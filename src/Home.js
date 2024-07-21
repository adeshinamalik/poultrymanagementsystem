import React, { useEffect, useState } from 'react';
import './css/style.css';
import myImages from './myImage.js';
import { ref, onValue } from 'firebase/database';
import database from './firebaseConfig';

const HomePage = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [eggSize, setEggSize] = useState('');
    const [feedingStatus, setFeedingStatus] = useState('Idle');
    const [startFeedingDateTime, setStartFeedingDateTime] = useState('');
    const [stopFeedingDateTime, setStopFeedingDateTime] = useState('');
    const [eggStatus, setEggStatus] = useState('Idle');
    const [startEggDateTime, setStartEggDateTime] = useState('');
    const [stopEggDateTime, setStopEggDateTime] = useState('');
    const [wasteStatus, setWasteStatus] = useState('Idle');
    const [startWasteDateTime, setStartWasteDateTime] = useState('');
    const [stopWasteDateTime, setStopWasteDateTime] = useState('');
    const [nextWasteDateTime, setNextWasteDateTime] = useState('');
    const [waterStatus, setWaterStatus] = useState('Idle');
    const [schedules, setSchedules] = useState({
        feeding: {
            startTime: '08:00',
            endTime: '18:00'
        },
        egg: {
            startTime: '10:00',
            endTime: '17:00'
        },
        waste: {
            startTime: '09:00',
            endTime: '16:00'
        }
    });

    useEffect(() => {
        const fetchData = () => {
            const currentTimeRef = ref(database, 'currentTime');
            onValue(currentTimeRef, (snapshot) => {
                setCurrentTime(snapshot.val());
            });

            const eggSizeRef = ref(database, 'eggSize');
            onValue(eggSizeRef, (snapshot) => {
                setEggSize(snapshot.val());
            });

            const schedulesRef = ref(database, 'schedules');
            onValue(schedulesRef, (snapshot) => {
                setSchedules(snapshot.val());
            });
        };

        fetchData();
    }, []);

    const handleStartStop = (system, action) => {
        const currentDateTime = new Date().toISOString();

        switch (system) {
            case 'Feeding':
                if (action === 'start') {
                    setFeedingStatus('Feeding');
                    setStartFeedingDateTime(currentDateTime);
                } else {
                    setFeedingStatus('Idle');
                    setStopFeedingDateTime(currentDateTime);
                }
                break;
            case 'Egg':
                if (action === 'start') {
                    setEggStatus('Collecting');
                    setStartEggDateTime(currentDateTime);
                } else {
                    setEggStatus('Idle');
                    setStopEggDateTime(currentDateTime);
                }
                break;
            case 'Waste':
                if (action === 'start') {
                    setWasteStatus('Removing');
                    setStartWasteDateTime(currentDateTime);
                } else {
                    setWasteStatus('Idle');
                    setStopWasteDateTime(currentDateTime);
                    setNextWasteDateTime('');
                }
                break;
            case 'Water':
                if (action === 'start') {
                    setWaterStatus('Pumping');
                } else {
                    setWaterStatus('Idle');
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const formattedCurrentTime = `${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`;

            if (formattedCurrentTime === schedules.feeding.startTime && feedingStatus === 'Idle') {
                handleStartStop('Feeding', 'start');
            } else if (formattedCurrentTime === schedules.feeding.endTime && feedingStatus === 'Feeding') {
                handleStartStop('Feeding', 'stop');
            }

            if (formattedCurrentTime === schedules.egg.startTime && eggStatus === 'Idle') {
                handleStartStop('Egg', 'start');
            } else if (formattedCurrentTime === schedules.egg.endTime && eggStatus === 'Collecting') {
                handleStartStop('Egg', 'stop');
            }

            if (formattedCurrentTime === schedules.waste.startTime && wasteStatus === 'Idle') {
                handleStartStop('Waste', 'start');
            } else if (formattedCurrentTime === schedules.waste.endTime && wasteStatus === 'Removing') {
                handleStartStop('Waste', 'stop');
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [schedules.feeding.startTime, schedules.feeding.endTime, schedules.egg.startTime, schedules.egg.endTime, schedules.waste.startTime, schedules.waste.endTime, feedingStatus, eggStatus, wasteStatus]);

    const getDataAsJSON = () => {
        const data = {
            currentTime,
            eggSize,
            feedingStatus,
            startFeedingDateTime,
            stopFeedingDateTime,
            eggStatus,
            startEggDateTime,
            stopEggDateTime,
            wasteStatus,
            startWasteDateTime,
            stopWasteDateTime,
            nextWasteDateTime,
            waterStatus
        };

        console.log(JSON.stringify(data, null, 2));
    };

    return (
        <div>
            <div className="system">
                <div className="sys-account">
                    <div>{currentTime}</div>
                    <div>FUNAAB POULTRY</div>
                    <img src={myImages.funaabLogo} alt="funaablogo" style={{ width: '200px' }} />
                </div>
                <div className="system-container">
                    <div className="headings">
                        <header>IOT BASED POULTRY MANAGEMENT SYSTEM</header>
                        <div>
                            <div className="header-text">System List <br /><span>Manage all the farm system at one place</span></div>
                            <div className="egg-count">
                                <div className="value">
                                    <div className="count-text">Average Egg Size (g)</div>
                                    <div>{eggSize}</div>
                                </div>
                                <div className="date">
                                    <div>Today</div>
                                    <div>This week</div>
                                    <div>This month</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="the-systems" method="POST" encType="multipart/form-data" action="/home">
                        <div className="feeding sec">
                            <div className="thehead">
                                <div className="sys-head">Feeding System</div>
                                <button type="button" onClick={() => handleStartStop('Feeding', 'start')} className="start">Start</button>
                                <button type="button" onClick={() => handleStartStop('Feeding', 'stop')} className="stop">Stop</button>
                                <img src={myImages.setting} alt="settings" />
                            </div>
                            <div className="image">
                                <img className="chick-img" src={myImages.chicken} alt="chickens" />
                            </div>
                            <div className="the-info">
                                <div className="the-amount">
                                    <div className="amount">
                                        <div className="level">Amount of Feed</div>
                                        <span className="percent">{feedingStatus}</span>
                                    </div>
                                    <div className="amount">
                                        <div className="level">Water Level</div>
                                        <span className="percent">75%</span>
                                    </div>
                                </div>
                                <div className="info">
                                    <div>Feeding Status</div> <span className="valueEl">{feedingStatus}</span>
                                    <hr />
                                    <div>Start Time</div><span className="valueEl">{startFeedingDateTime}</span>
                                    <hr />
                                    <div>End Time</div><span className="valueEl">{stopFeedingDateTime}</span>
                                    <hr />
                                    <div className="schedule">
                                        <div>schedule:</div>
                                        <span className="start-time">Start Time: <span className="valueEl">{schedules.feeding.startTime}</span></span>
                                        <span className="end-time">End Time: <span className="valueEl">{schedules.feeding.endTime}</span></span>  
                                    </div>
                                    <div className="sys-info">
                                        <div>System Information</div><span><img src={myImages.arrowRight} alt="systeminfo" /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="egg sec">
                            <div className="thehead">
                                <div className="sys-head">Egg Collection</div>
                                <button type="button" onClick={() => handleStartStop('Egg', 'start')} className="start">Start</button>
                                <button type="button" onClick={() => handleStartStop('Egg', 'stop')} className="stop">Stop</button>
                                <img src={myImages.setting} alt="settings" />
                            </div>
                            <div className="image">
                                <img className="chick-img" src={myImages.egg} alt="chickens" />
                            </div>
                            <div className="the-info">
                                <div className="the-amount">
                                    <div className="amount">
                                        <div className="level">Egg Size</div>
                                        <span className="percent">{eggSize}</span>
                                    </div>
                                </div>
                                <div className="info">
                                    <div>Egg Status</div><span className="valueEl">{eggStatus}</span>
                                    <hr />
                                    <div>Start Time</div><span className="valueEl">{startEggDateTime}</span>
                                    <hr />
                                    <div>End Time</div><span className="valueEl">{stopEggDateTime}</span>
                                    <hr />
                                    <div className="schedule">
                                        <div>schedule:</div>
                                        <span className="start-time">Start Time: <span className="valueEl">{schedules.egg.startTime}</span></span>
                                        <span className="end-time">End Time: <span className="valueEl">{schedules.egg.endTime}</span></span>  
                                    </div>
                                    <div className="sys-info">
                                        <div>System Information</div><span><img src={myImages.arrowRight} alt="systeminfo" /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="waste sec">
                            <div className="thehead">
                                <div className="sys-head">Waste Management</div>
                                <button type="button" onClick={() => handleStartStop('Waste', 'start')} className="start">Start</button>
                                <button type="button" onClick={() => handleStartStop('Waste', 'stop')} className="stop">Stop</button>
                                <img src={myImages.setting} alt="settings" />
                            </div>
                            <div className="image">
                                <img className="chick-img" src={myImages.waste} alt="chickens" />
                            </div>
                            <div className="the-info">
                                <div className="the-amount">
                                    <div className="amount">
                                        <div className="level">Waste Level</div>
                                        <span className="percent">75%</span>
                                    </div>
                                </div>
                                <div className="info">
                                    <div>Waste Status</div><span className="valueEl">{wasteStatus}</span>
                                    <hr />
                                    <div>Start Time</div><span className="valueEl">{startWasteDateTime}</span>
                                    <hr />
                                    <div>End Time</div><span className="valueEl">{stopWasteDateTime}</span>
                                    <hr />
                                    <div>Next Waste Removal Time</div><span className="valueEl">{nextWasteDateTime}</span>
                                    <hr />
                                    <div className="schedule">
                                        <div>schedule:</div>
                                        <span className="start-time">Start Time: <span className="valueEl">{schedules.waste.startTime}</span></span>
                                        <span className="end-time">End Time: <span className="valueEl">{schedules.waste.endTime}</span></span>  
                                    </div>
                                    <div className="sys-info">
                                        <div>System Information</div><span><img src={myImages.arrowRight} alt="systeminfo" /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="water sec">
                            <div className="thehead">
                                <div className="sys-head">Water Pumping</div>
                                <div className="start">Error</div>
                                <button type="button" onClick={() => handleStartStop('Water', 'start')} className="start">Start</button>
                                <button type="button" onClick={() => handleStartStop('Water', 'stop')} className="stop">Stop</button>
                                <img src={myImages.setting} alt="settings" />
                            </div>
                            <div className="image">
                                <img className="chick-img" src={myImages.water} alt="chickens" />
                            </div>
                            <div className="the-info">
                                <div className="the-amount">
                                    <div className="amount">
                                        <div className="level">Water Level</div>
                                        <span className="percent">75%</span>
                                    </div>
                                </div>
                                <div className="info">
                                    <div>Water Status</div><span className="valueEl">{waterStatus}</span>
                                    <hr />
                                    <div className="sys-info">
                                        <div>System Information</div><span><img src={myImages.arrowRight} alt="systeminfo" /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div>
                        <div>
                            <h2>Data as JSON</h2>
                            <button onClick={getDataAsJSON}>Get Data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
