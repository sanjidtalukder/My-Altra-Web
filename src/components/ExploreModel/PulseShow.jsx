import React from 'react';

const pulseShow = [
    "https://i.ibb.co.com/yrPDtGw/Screenshot-2025-08-23-170241.png",
"https://i.ibb.co.com/qF7RKLmk/Screenshot-2025-08-23-170307.png",
"https://i.ibb.co.com/GQ1D8dG1/Screenshot-2025-08-23-170418.png",
"https://i.ibb.co.com/cSpkjs3Q/Screenshot-2025-08-23-170333.png",
];
const PulseShow = () => {

    const [currentShow, setCurrentShow] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentShow((prevShow) => (prevShow + 1) % pulseShow.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }   , []);
    return (
        <div>
            
        </div>
    );
};

export default PulseShow;