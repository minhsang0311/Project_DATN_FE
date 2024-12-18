import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import '../styles/components/Home.css'


function DanhMuc_Home() {
    const [list, ganListLoai] = useState( [] );
    useEffect ( () => {
        fetch(`${process.env.REACT_APP_HOST_URL}user/category`)
        .then(res=>res.json())
        .then( data => ganListLoai(data) );
    } , []);
    return (
        <div className="home">
            <div className="listdanhmuc_home">
                <h1>DANH MỤC NỔI BẬT</h1>
                <div className="box">
                { list.map( (loai, index)=>
                    <Link to = { "/category/" + loai.Category_ID } key={index}>
                    <div className="box-dm">
                        <img src={loai.Category_Image} alt={loai.Category_Name} />
                        <Link to = { "/category/" + loai.Category_ID }>{loai.Category_Name}</Link> 
                    </div>
                    </Link>
                )}
                </div>
            </div>
        </div>
    );
}
export default DanhMuc_Home;
