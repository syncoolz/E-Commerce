import React from 'react';
import {API} from '../config';
import '../styles.css';

const ShowImage = ({item, url}) => {

    return (
        <div className="product-img">
            <img
                src={url}
                alt={item.title}
                className="mb-3"
                style={{
                maxHeight: '100%',
                maxWidth: '100%'
            }}/>
        </div>
    );
};

export default ShowImage
