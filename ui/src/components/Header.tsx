'use client'

import { useState, useRef, useEffect } from "react";
import { useMainContext } from "./MainContext";

function Header () {
  const {routes, addRoute, removeRoute, changeCurrentPage, currentPage} = useMainContext()
  const [newRoute, setNewRoute] = useState<string>('')
  const [modal, setModal] = useState<number>(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const modalOverlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(modal > -1) buttonRef.current?.focus()  
  }, [modal])

  return <div className="flex flex-row gap-2 max-w-[calc(100vw_-_200px_-_250px)] overflow-x-auto p-2 shadow-lg z-30">
    {routes.length > 0 && routes.map(({page}, index) => {
      return <button 
        className={`route-btn whitespace-nowrap flex flex-row gap-3 group transition-all ${currentPage === index ? 'active' : ''}`} 
        key={index}
        onClick={() => {changeCurrentPage(index)}}
      >
        <span>{page}</span>
        <div className="px-2 hover:text-red-500 hidden group-focus:block " onClick={()=>{
          setModal(index)
        }}>&times;</div>
      </button>
    })}
    <button className="route-btn flex flex-row" onClick={()=>inputRef.current?.focus()}>
      <span>{newRoute || ''}</span>
      <form onSubmit={(e) => {
        e.preventDefault();
        if(newRoute.trim()) {
          addRoute(newRoute)
          setNewRoute('')
        }
        else {
          inputRef.current?.focus()
        }
      }}>
        <input 
          type="text" 
          ref={inputRef} 
          value={newRoute} 
          onChange={(e) => setNewRoute(e.target.value)} 
          className="w-0 outline-none peer" 
        />
        <span className="peer-focus:hidden inline">+</span>
        <span className="animate-ping peer-focus:inline hidden">|</span>
      </form>
    </button>
      {modal > -1 && <div className="fixed top-0 left-0 bg-black/5 flex items-center justify-center w-full h-screen z-50"  onClick={(e) => {if(e.target === modalOverlayRef.current) setModal(-1)}} ref={modalOverlayRef}>
      <div className="bg-white p-10 shadow-lg">
        <div className="mb-3">Delete page?</div>
        <div className="flex flex-row justify-center gap-3">
          <button 
            className="modal-btn hover:bg-green-300 focus:bg-green-300" 
            ref={buttonRef}
            onClick={()=>setModal(-1)}
          >&times;</button>
          <button 
            className="modal-btn text-red-400 hover:bg-red-400 hover:text-white hover:border-transparent focus:bg-red-400 focus:text-white focus:border-transparent"
            onClick={() => {
              if(modal > -1) removeRoute(modal)
              setModal(-1)
            }}
          >o</button>
        </div>
      </div>
    </div>}
  </div>
}

export default Header