import * as React from 'react';
import {useCallback, useRef} from 'react';
import HomePageImg from "./HomePageImg";
import PortalGoalsSection from "./PortalGoalsSection";
import FacultyTipsSection from "./FacultyTipsSection";
import StudentTermsSection from "./StudentTermsSection";


export const ScrollContext = React.createContext<(() => void) | null>(null);

function HomePage() {

    const myRef = useRef<HTMLDivElement>(null);

    const executeScroll = useCallback(() => {
        if (myRef.current) {
            myRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, []);

    return (
        <div>
            <HomePageImg/>
            <ScrollContext.Provider value={executeScroll}>
                <PortalGoalsSection/>
                <FacultyTipsSection/>
                <div ref={myRef}>
                    <StudentTermsSection/>
                </div>
            </ScrollContext.Provider>
            {/*<FacultiesPage/>*/}
        </div>
    )
        ;
}

export default HomePage;