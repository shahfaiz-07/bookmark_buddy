// import React from 'react'
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { resetTagData } from "../features/tagSlice"
const Navigator = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toAdder = () => {
    dispatch(resetTagData());
    navigate("/adder")
  }
  return (
    <div className="flex flex-col gap-y-2 text-white items-center justify-center py-10 min-w-[320px] bg-slate-900">
      <h1 className="text-lg font-semibold">Bookmark Buddy</h1>
      <button className="px-3 py-2 text-sm bg-orange-600 rounded font-semibold" onClick={toAdder}>
        Add BookMark
      </button>
      <Link to={'/manager'} className="px-3 py-2 text-sm bg-red-600 rounded font-semibold">
        Bookmark List
      </Link>
      <Link to={'/tags'} className="px-3 py-2 text-sm bg-pink-800 rounded font-semibold">
        Manage Categories
      </Link>
    </div>
  )
}

export default Navigator
