import axios from 'axios';

const axi = axios.create({
    baseURL: `http://127.0.0.1:3003`
});

const categoryAPI = {
    getAll: () => axi.get(`/category`),
    create: (formData) => axi.post(`/category`,
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        }),
    update: (id, formData) => axi.put(`/category/${id}`,
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        }),
    delete: (id) => axi.delete(`/category/${id}`),

}

const productAPI = {
    getAll: () => axi.get(`/product`),
    getById: (id) => axi.get(`/product/${id}`),
    getByCategoryId: (id) => axi.get(`/product/byCategory/${id}`),
    create: (formData) => axi.post(`/product`,
        formData,
        {
            headers: {
                'Content-Type': `application/json`
            }
        }),
    update: (id, formData) => axi.put(`/product/${id}`,
        formData,
        {
            headers: {
                'Content-Type': `application/json`
            }
        }),
}

const provinceAPI = {
    getAll: () => axi.get(`https://provinces.open-api.vn/api/?depth=2`),
    getGeoCodeing: (searchTerm) => axi.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?country=vn&limit=5&types=district%2Ccountry%2Clocality%2Cneighborhood%2Cpoi&access_token=${process.env.REACT_APP_MAPBOX_KEY}`),
    calculateShippingCharges: ({myLng,myLat,cusLng, cusLat}) => axi.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${myLng},${myLat};${cusLng},${cusLat}?alternatives=true&geometries=geojson&language=vn&overview=simplified&steps=true&access_token=${process.env.REACT_APP_MAPBOX_KEY}`)
}

const orderAPI = {
    create: (data) => axi.post(`/order`,data,{
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export default { categoryAPI, productAPI, provinceAPI, orderAPI };