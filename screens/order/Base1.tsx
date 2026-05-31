import React from 'react'
import CardList from './CardList'
import Header from './Header'
import Table from './Table'
import AdminSearch from '../../ui/AdminSearch'

export default function Base1() {
  return (
    <div className='p-3 space-y-4'>
        <Header />
        <CardList />
        <AdminSearch />
        <Table />
    </div>
  )
}
