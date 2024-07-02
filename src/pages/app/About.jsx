import { Box } from "@chakra-ui/react"

const About = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column" , margin: "auto",marginTop: "10vh", width: "70%" }}>
            <b style={{margin:"auto", fontSize: "20px", marginBottom: "40px"}}>How does Laughie works?</b>
            <p>
                The Laughie (Laugh Intentionally Everyday) Laughter Prescription is a new way of laughing.  For some people it will be more challenging than others.
                The idea is to harness and enjoy laughter without having to rely on external humour - although that is not to say you can't enjoy external humour to get you laughing if you feel you need to do that.
                The objective is to sustain your laughter for 1 minute to get a good laughter work-out.
            </p>
            <br/>
            <p style={{paddingTop: "2vw" , paddingBottom: "2vw" }}>
                Because we will be using the recording to analyse your audio and visual laughter, when you record place your face in the frame on the screen.
                <ul style={{padding: "1vw"}}>                
                <li>To record videos, you click on the button that says 'Record a Video' </li>
                 <li>To view videos, click on the button that says 'View Videos' (note that you can only view videos by date recorded.) </li>
                    <li>An added bonus is the 'Create Reminder' button that helps you set a time a date to record videos.</li>
                    <li>After doing this, an email will be sent containing the calendar link, sign in and set a reminder. Voila😅</li>
                </ul>
                Don't forget to update your profile too. Very Important😉
            </p>
            <p style={{paddingTop: "1vw", paddingBottom: "2vw"}}>
                Beware: The Laughie is very safe.  But if you are feeling unwell at any time during the 1 minute, please stop and do not continue until you are feeling better.

                There are four overall instructions as below, and also look at the visual and the notes for more information:
                <ul style={{padding: "1vw"}}>
                <li>Aim to laugh as naturally and as joyfully as you can</li>
                <li>Enjoy the one minute of laughter "your way" - what ever gets you laughing for one minute</li>
                <li>Train to gain - it may take time to get used to: keep practicing!</li>
                <li>Laugh for a reason - be it for reducing stress, increasing energy, or whatever - find your motivation</li>
                </ul>
            </p>
        </div>
    )
}

export default About