import SearchPage from '@/components/SearchPage'
import React from 'react'

const page = async ({ params }: { params: { query: string } }) => {
    const { query } = await params
    return (
        <SearchPage query={query} />
    )
}

export default page