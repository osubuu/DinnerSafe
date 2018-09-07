// Event page for a single event

import React, { Component } from "react";
import DisplayMatchingRecipes from "../DisplayMatchingRecipes/DisplayMatchingRecipes";

class EventPage extends Component {
    render(){
        return(
            <div>
                <h2>EVENT NAME FOR SPECIFIC EVENT</h2>
                
                <div className="guestList">
                    <ul>
                        
                        {/* map over array of guests and build for each guest*/}
                        <li>
                            
                            {/* Edit the guests restrictions */}
                            <a href="#placeholderToEditGuestRestrictions">
                            
                                <p>FirstName LastName</p>
                                
                                {/* Fake button to make it clear you can click on the guest to edit them */}
                                <div className="fakeButton">
                                    <p>Edit</p>
                                </div>
                            
                            </a>
                            
                            {/* Removes guest from the event */}
                            <a href="#placeHolderToRemoveGuestFromEvenet">Remove From Event</a>

                        </li>

                    </ul>

                    <a href="#AddExistingGuest">Add Existing Guest</a>
                    <a href="#AddNewGuest">Add New Guest</a>
                </div>

                <DisplayMatchingRecipes userProfile={this.props.userProfile} eventName={this.props.eventName}/>

            </div>
        )
    }
}

export default EventPage;