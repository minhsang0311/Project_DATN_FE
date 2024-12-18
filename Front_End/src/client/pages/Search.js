import { Link, useLocation } from "react-router-dom";
import { useState, useEffect ,Fragment} from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "./cartSlice"; // Import hành động thêm vào giỏ hàng

import '../styles/components/Search.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch(); // Khởi tạo useDispatch


    // Use useLocation to get the current search query from URL
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('query');
        setSearchQuery(query || "");

        if (query) {
            fetch(`${process.env.REACT_APP_HOST_URL}user/products_search/?query=${query}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then(data => {
                    setSearchResults(data);
                    console.log("Search results", data); // Log the fetched data
                })
                .catch(error => console.error("Error fetching search results:", error));
        } else {
            setSearchResults([]);
        }
    }, [location.search]); // Run the effect when the search query changes

    const handleAddToCart = (product) => {
        const cartItem = {
            id: product.Product_ID,
            image: product.Image,
            name: product.Product_Name,
            price: product.Promotion > 0 ? product.Price - (product.Promotion * product.Price) / 100 : product.Price,
            quantity: 1 // Mặc định là 1
        };
        dispatch(addToCart(cartItem)); // Gửi hành động thêm vào giỏ hàng
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    return (
        <Fragment>
            <Header/>
        <div className="search-page">
            <div className="header1">
                <p>Có <span>{searchResults.length}</span> sản phẩm với từ khóa " <span>{searchQuery}</span> "</p>
            </div>
            <div className="box-sp">
                {searchResults.length > 0 ? (
                    searchResults.map((sp, i) => (
                        <div key={i} className="product">
                            {sp.Promotion > 0 && (
                                <p className="discount-label">-{sp.Promotion}%</p>
                            )}
                            <div className="img-wrapper">
                                <img src={sp.Image} alt={sp.Product_Name} />
                            </div>
                            <Link to={`/productDetail/${sp.Product_ID}`}>{sp.Product_Name}</Link>
                            <div className="price_giohang">
                                <div className="price">
                                    {sp.Promotion > 0 ? (
                                        <>
                                            <p className="old-price">{formatCurrency(sp.Price)}</p>
                                            <p className="new-price">{formatCurrency(sp.Price - (sp.Promotion * sp.Price) / 100)}</p>
                                        </>
                                    ) : (
                                        <p className="new-price">{formatCurrency(sp.Price)}</p>
                                    )}
                                </div>
                                <button className="add-to-cart" onClick={() => handleAddToCart(sp)}>Giỏ hàng</button>
                            </div>
                        </div>
                    ))
                ) : (
                    ""
                )}
            </div>
        </div>
        <Footer />
        </Fragment>
    );
}

export default Search;
