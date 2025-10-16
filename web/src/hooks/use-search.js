// src/hooks/use-search.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/menu/search/${searchTerm.trim()}`)
      setSearchTerm('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    handleKeyPress
  }
}