import {useState} from 'react';
import './index.css'
import axios from 'axios';

function ProductDetail () {
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();

  const [showPopup, setShowPopup] = useState(false)
  const [photoUrl, setPhotoUrl] = useState()

  const [skuCode, setSkuCode] = useState();
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const accept = () => {
    const skus = products[0].skus;
    const foundedItem = skus.find(item => item.attrs.Color === selectedColor && item.attrs.Size === selectedSize)

    setPhotoUrl(foundedItem.images[0])
    setSkuCode(foundedItem.sku)
  }

  const changeProduct = (code) => {

    axios.get(`https://api-dev.smartgiftit.com/apps/products?merchantCode=vineyardvines&codes[]=${code}`, { headers : 
      {
        'x-smartgift-app-id': 'zOdeE81mInZIiPLrdHRd0IVZ1a2vv42p6tvh8SX3',
        'x-smartgift-app-secret': 'ldPn67Cf7e0NboidnQ30KTtrfD1nqPpoSqs69EfH'
      }
    }).then(response => {
      setProducts(response.data.data)
      setColor(response.data.data[0].attrList.Color)
      setSelectedColor(response.data.data[0].attrList.Color[0])
      setSize(response.data.data[0].attrList.Size)
      setSelectedSize(response.data.data[0].attrList.Size[0])

      const skus = response.data.data[0].skus;
      const foundedItem = skus.find(item => item.attrs.Color === response.data.data[0].attrList.Color[0] && item.attrs.Size === response.data.data[0].attrList.Size[0])
      setPhotoUrl(foundedItem.images[0])
      setSkuCode(foundedItem.sku)
    }).catch(error => {
      console.log('Error')
      console.log(error)
    })
  };

  const showPopupFunc = () => {
    setShowPopup(true)
  };

  const closePopupFunc = () => {
    setShowPopup(false)
  };

  const changeBackgroundColor = (payload) => {
    setBackgroundColor(payload)
    document.body.style.backgroundColor = payload;
  }

  const changeSize = (payload) => {
    accept();
    setSelectedSize(payload);
  }

  const changeColor = (payload) => {
    accept();
    setSelectedColor(payload);
  }

  return (
    <div className="test-class">
      {showPopup ? 
        <div className="popup">
          <div className="popup_inner">
            SKU CODE: {skuCode}
            <button onClick={() => closePopupFunc()}>CLOSE</button>
          </div>
        </div>
      : null}

      <input type="color" value={backgroundColor} onChange={event => changeBackgroundColor(event.target.value)} />
      
      <div className="columns">
        <div className="column">
          <button onClick={() => changeProduct('1K000006')}>Pullover</button>
        </div>
        <div className="column">
          <button onClick={() => changeProduct('1T010212')}>Tie</button>
        </div>
        <div className="column">
          <button onClick={() => changeProduct('1T010182')}>Bowtie</button>
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <div>Product Details</div>
          {photoUrl ? 
            <img src={photoUrl} />
          : null}
          {products.map((item) => 
            <div dangerouslySetInnerHTML={{__html: item.desc}}></div>
          )}
        </div>

        <div className="column">
          <div className="columns">
            <label>
              Size
              <select value={selectedSize} onChange={event => changeSize(event.target.value)}>
                {size.map((item) => 
                  <option>{item}</option>  
                )}
              </select>
            </label>
          </div>
          
          <div className="columns">
            <label>
              Color
              <select value={selectedColor} onChange={event => changeColor(event.target.value)}>
                {color.map((item) => 
                  <option>{item}</option>  
                )}
              </select>
            </label>
          </div>
          <div className="columns">
            <button onClick={() => showPopupFunc()}>SHOW SKU CODE</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail;