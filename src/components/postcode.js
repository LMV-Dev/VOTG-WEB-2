import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

const Postcode = ({buttonStyle}) => {
  const open = useDaumPostcodePopup();

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    window.open(`https://map.naver.com/p/search/${encodeURIComponent(fullAddress)}`);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <button style={buttonStyle} type='button' onClick={handleClick}>
      부동산 주소 검색
    </button>
  );
};

export default Postcode