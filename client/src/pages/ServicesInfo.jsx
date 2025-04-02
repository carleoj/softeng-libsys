import React from 'react';
import './styles/ServicesInfo.css';

const ServicesInfo = () => {
  return (
    <div className="services-info">
      <h2>SERVICES INFO</h2>
      <div className="services-container">
        <div className="left-services-container">
          <p className="service-title">Library Services Hours</p> 
          <p className="service-hours">Monday - Thursday (7:00 am - 6:00 pm)</p>
          <p className="service-hours">Friday (7:00 am - 5:00 pm)</p>
          <p className="service-hours">Saturday - Sunday (Closed)</p>
          <br />
          <p className="service-title">How to request a print copy?</p> 
          <p className="service-hours">On the Print Requests Page {'>'} Click Add Request, Fill in
            the required fields, and click Submit.</p>
          <br />
          <p className="service-title">How soon can I receive my print request?</p> 
          <p className="service-hours">Please note that the library's printing service operates on a first-come, first-served basis.</p>
          <p className="service-hours">The time it takes for your request to be printed may vary depending on how early you submitted it.</p>
          <p className="service-hours">During busier periods, processing times may be longer, so be sure to keep track of the status of your request.</p>
        </div>
        <div className="right-services-container">
          <p className="service-title">Print Services Charges</p> 
          <p className="service-hours">Prices may vary depending on the size/color of the paper/image.</p>
          <p className="service-hours">Usually for plain texts on short bond paper, 2.50 pesos.</p>
          <p className="service-hours">Be sure to check the price of your request on the print requests page.</p>
          <br />
          <p className="service-title">Can I cancel my request once submitted?</p> 
          <p className="service-hours">The request can be cancelled anytime after you submit it. However, once the status is marked as printed, you need to pay it on the library.</p>
          <br />
          <p className="service-title">Clearance & Obligations</p> 
          <p className="service-hours">If you have any unsettled charges or credits in the library, your clearance will be marked as uncleared.</p> 
        </div>
      </div>
    </div>
  );
};

export default ServicesInfo;
