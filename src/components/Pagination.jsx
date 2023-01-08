import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import PropTypes from 'prop-types'

MyPagination.propTypes = {
    activePage: PropTypes.number,
    totalPages: PropTypes.number,
    onClick: PropTypes.func,
};

function MyPagination(props) {
    const { activePage, totalPages, onClick } = props

    function handleClick(page) {
        if(onClick)
            onClick(page)
    }

    return (
        <Pagination size="lg" style={{marginLeft: "430px"}}>
            {
                [...Array(totalPages).keys()].map((item) => {
                    item = item + 1
                    return (
                        <Pagination.Item key={item} active={item === activePage} onClick={() => {handleClick(item)}}>
                            {item}
                        </Pagination.Item>
                    )
                })
            }
        </Pagination>
    );
}

export default MyPagination;