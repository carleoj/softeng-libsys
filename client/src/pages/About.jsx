import React from 'react';
import './styles/About.css';

const About = () => {
  return (
    <div className="about">
      <div className="about-container">
        <h2>THE TEAM BEHIND SPAC LIBRARY SYSTEM</h2>
        <div className="inner-about-container">
          <div className="inner-about-container-top">
            <div className="img-text-container">
              <div className="img-container-carl">
                <img src="../src/assets/carlpic2.jpg" alt="Carl" />
              </div>
              <div className="text-content">
                <h3>Carl</h3>
                <p>Full-Stack Developer,</p>
                <p>System Designer,</p>
                <p>& Tester</p><br></br>
              </div>
            </div>
          </div>
          <div className="inner-about-container-bot">
            <div className="img-text-container">
              <div className="img-container-kate">
                <img src="../src/assets/kate_pic.jpeg" alt="Kate" />
              </div>
              <div className="text-content">
                <h3>Kate</h3>
                <p>Documentation Team/</p>
                <p>Technical Writer</p>
              </div>
            </div>
            <div className="img-text-container">
              <div className="img-container-jc">
                <img src="../src/assets/jc_pic.png" alt="JC" />
              </div>
              <div className="text-content">
                <h3>JC</h3>
                <p>Documentation Team/</p>
                <p>Technical Writer</p>
              </div>
            </div>
          </div>
          
        </div>

        <div className="about-system-container">
            
        </div>
      </div>
    </div>
  );
};

export default About;
