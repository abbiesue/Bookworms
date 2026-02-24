import React from 'react';
import './feed.css'

export function Feed(props) {
    const userResponse = localStorage.getItem(`response_${props.userName}`);
    return (
        <main>
            <div className="promptContainer" id="dropFirst">
                <h1>~Daily Prompt~</h1>
                <input type="checkbox" id="expandToggle" hidden />
                <label htmlFor="expandToggle">⬇Click to Reveal Prompt⬇</label>
                <div id="expandedContent">
                "Two friends realize they are characters in a comic; one is the hero, one the villain..."
                </div>
            </div>
            <div className="feed" id="dropFirst">
                <h2>Friend Feed:</h2>
                <div className="response">
                    <div className="responseAuthorContainer"><span className="responseAuthor">{props.userName}</span> wrote:</div>
                    <div className="responseText"> 
                        <details>
                            <summary>
                                "{userResponse?.substring(0, 50)}..."
                            </summary>
                            <div className="fullText">{userResponse || "No response found."}</div>
                        </details>
                    </div>
                    <div className="reactionPanel">
                        <button className="reactButton" id="likeButton">
                            <input type="checkbox" id="like1" />
                            <label htmlFor="like1"></label>
                        </button> 
                        <button className="reactButton" id="laughButton">
                            <input type="checkbox" id="laugh1" />
                            <label htmlFor="laugh1"></label>
                        </button>
                        <button className="reactButton" id="cryButton">
                            <input type="checkbox" id="cry1" />
                            <label htmlFor="cry1"></label>
                        </button>

                        <input className="critiqueToggle" type="checkbox" id="critiqueToggle1" hidden />
                        <label htmlFor="critiqueToggle1">💬 Critiques</label>
                        <div id="expandedCritiques">
                            <div className="critiqueFeed">
                                <div className="existingCritiques">
                                    <h4>Critiques:</h4>
                                    <div className="critique">
                                        <div className="critiqueAuthor">Mia_writes</div>
                                        <div className="critiqueText">I'm so impressed!</div>
                                    </div>

                                    <div className="critique">
                                        <div className="critiqueAuthor">Tomatoe505</div>
                                        <div className="critiqueText">fr fr I cried</div>
                                    </div>
                                </div>

                                <div className="addCritique">
                                    <h4>Add a critique:</h4>
                                    <textarea className="critiqueInput" rows="3" placeholder="Write your critique here..."></textarea>
                                    <button className="submitCritique">Post Critique</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="response">
                    <div className="responseAuthorContainer"><span className="responseAuthor">Mia_writes</span> wrote:</div>
                    <div className="responseText"> 
                        <details>
                            <summary>
                                "'Don't do it,' he pleaded."
                            </summary>
                            <div className="fullText"> "Don't do it," he pleaded. <p>"This is the way," I, the mandolorian replied. Thankfully my super awesome mask covered my tears as I raised the blaster. "So long, friend."</p></div>
                        </details>
                    </div>
                    <div className="reactionPanel">
                        <button className="reactButton" id="likeButton">
                            <input type="checkbox" id="like2" />
                            <label htmlFor="like2"></label>
                        </button> 
                        <button className="reactButton" id="laughButton">
                            <input type="checkbox" id="laugh2" />
                            <label htmlFor="laugh2"></label>
                        </button>
                        <button className="reactButton" id="cryButton">
                            <input type="checkbox" id="cry2" />
                            <label htmlFor="cry2"></label>
                        </button>

                        <input className="critiqueToggle" type="checkbox" id="critiqueToggle2" hidden />
                        <label htmlFor="critiqueToggle2">💬 Critiques</label>
                        <div id="expandedCritiques">
                            <div className="critiqueFeed">
                                <div className="existingCritiques">
                                    <h4>Critiques:</h4>
                                    <div className="critique">
                                        <div className="critiqueAuthor">Tomatoe505</div>
                                        <div className="critiqueText">lol I love Mando, where's grogu?</div>
                                    </div>

                                    <div className="critique">
                                        <div className="critiqueAuthor">Tomatoe505</div>
                                        <div className="critiqueText">wait does this count as fanfic?</div>
                                    </div>
                                </div>

                                <div className="addCritique">
                                    <h4>Add a critique:</h4>
                                    <textarea className="critiqueInput" rows="3" placeholder="Write your critique here..."></textarea>
                                    <button className="submitCritique">Post Critique</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="response">
                    <div className="responseAuthorContainer"><span className="responseAuthor">Tomatoe505</span> wrote:</div>
                    <div className="responseText"> 
                        <details>
                            <summary>
                                "Hey guys, I'm trying to keep my streak lol"
                            </summary>
                            <div className="fullText"> Hey guys, I'm trying to keep my streak lol. I'll be serious about it tomorrow. Leave a like if you're watching the game tonight.</div>
                        </details>
                    </div>
                    <div className="reactionPanel">
                        <button className="reactButton" id="likeButton">
                            <input type="checkbox" id="like3" />
                            <label htmlFor="like3"></label>
                        </button> 
                        <button className="reactButton" id="laughButton">
                            <input type="checkbox" id="laugh3" />
                            <label htmlFor="laugh3"></label>
                        </button>
                        <button className="reactButton" id="cryButton">
                            <input type="checkbox" id="cry3" />
                            <label htmlFor="cry3"></label>
                        </button>

                        <input className="critiqueToggle" type="checkbox" id="critiqueToggle3" hidden />
                        <label htmlFor="critiqueToggle3">💬 Critiques</label>
                        <div id="expandedCritiques">
                            <div className="critiqueFeed">
                                <div className="existingCritiques">
                                    <h4>Critiques:</h4>
                                    <div className="critique">
                                        <div className="critiqueAuthor">Mia_writes</div>
                                        <div className="critiqueText">My like depends on which game you mean...</div>
                                    </div>

                                    <div className="critique">
                                        <div className="critiqueAuthor">Tomatoe505</div>
                                        <div className="critiqueText">the byu basketball game. go cougs!</div>
                                    </div>
                                </div>

                                <div className="addCritique">
                                    <h4>Add a critique:</h4>
                                    <textarea className="critiqueInput" rows="3" placeholder="Write your critique here..."></textarea>
                                    <button className="submitCritique">Post Critique</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>    
    );
}