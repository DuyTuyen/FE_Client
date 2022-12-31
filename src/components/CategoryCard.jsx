import React from 'react'
import PropTypes from 'prop-types'

const CategoryCard = props => {
    const { item,style } = props

    return (
        <div className="category_product">
            <div style={style} className="category_product_item">
                <img className='image_category' src={`${process.env.REACT_APP_CLOUDINARYURL}${item.img}`} />
                <div class="a">
                    {item.name}
                </div>
            </div>

        </div>
    )
}

CategoryCard.propTypes = {
    item: PropTypes.object,
    style: PropTypes.object,
}

export default CategoryCard