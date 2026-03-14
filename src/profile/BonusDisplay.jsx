import { useLocation } from 'react-router-dom';
import React from 'react';

export function BonusDisplay() {
    const location = useLocation();
    const [bonuses, setBonuses] = React.useState([]);
    React.useEffect(() => {
        async function getBonuses() {
            const res = await fetch('/api/bonus');
            if (res.ok) {
                const data = await res.json();
                setBonuses(data);
            }
        }
        getBonuses();
    }, [location]);

    const completedCount = bonuses.filter(b => b.completed).length;

    return (
        <div className="dailyBonuses" id="dropThird">
            <span style={{ fontSize: "large" }}>DAILY BONUSES:</span>
            <span className="bonusProgress">{completedCount}/{bonuses.length}</span>
            <ul>
                {bonuses.map((bonus, index) => (
                    <li className="bonus" key={index}>
                        <span>{bonus.completed ? '🌟' : '⭐️'}</span>
                        <span className={bonus.completed ? 'text completed' : 'text'}>{bonus.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
