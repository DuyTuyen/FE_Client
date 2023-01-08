import React from 'react'
import PropTypes from 'prop-types'

import Grid from './Grid'
import ProductCard from './ProductCard'
import MyPagination from './Pagination'

const InfinityList = props => {
    const { data, pagination, onChangePage } = props

    return (
        <div >
            <Grid
                col={3}
                mdCol={2}
                smCol={1}
                gap={20}
            >
                {
                    data.map((item, index) => (
                        <ProductCard
                            key={index}
                            product={item}
                        />
                    ))
                }
            </Grid>
            {
                data?.length > 0 &&
                <MyPagination
                    activePage={pagination?.activePage}
                    totalPages={pagination?.totalPages}
                    onClick={onChangePage}
                />
            }

        </div>
    )
}

InfinityList.propTypes = {
    data: PropTypes.array.isRequired,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
}

export default InfinityList
