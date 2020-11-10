import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import axios from 'axios';

function FileUpload(props) {
  // 들어온 이미지 정보를 array로 받음
  const [Images, setImages] = useState([]);

  // (파일을 올리는곳) 파일을 디비로 전달
  const dropHandler = (files) => {
    // 파일을 전송할때 같이 보내줘야하는것
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' }, // 어떠한 파일인지 타입을 정해줘서 백에서 받을떄 에러없이받게
    };
    formData.append('file', files[0]);

    axios
      .post('/api/product/image', formData, config) //formData, config같이 넣어줘서 보내야 에러가 안남
      .then((response) => {
        //백에서 보내준 정보가 response안에 있음
        if (response.data.success) {
          // product에서 보내준 파일이 성공적으로 온다면

          // 올린 파일 이미지 정보를 받아서 넣는다
          setImages([...Images, response.data.filePath]);
          props.refreshFunction([...Images, response.data.filePath]);
        } else {
          alert('파일을 저장하는데 실패했습니다.');
        }
      });
  };

  const deleteHandler = (image) => {
    const currentIndex = Images.indexOf(image); // 햔제 산텍된 이미지 인덱

    let newImages = [...Images]; // Images State에 들어있는 이미지들을 다 복사해준다
    //splice: 0부터(currentIndex) 시작해서 1개의 이미지를 newImages라는 Array에서 지워준다
    newImages.splice(currentIndex, 1);
    setImages(newImages);
    props.refreshFunction(newImages);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* 이미지 넣는곳 */}
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: '1px solid lightgray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{ fontSize: '3rem' }} />
          </div>
        )}
      </Dropzone>

      {/* 썸네일 보는곳 */}
      <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
        {Images.map((image, index) => (
          <div onClick={() => deleteHandler(image)} key={index}>
            <img
              style={{ minWidth: '300px', width: '300px', height: '240px' }}
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default FileUpload;
