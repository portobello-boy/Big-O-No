import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Minimap from 'react-minimap';
//import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

// Get CSS
import 'react-minimap/dist/react-minimap.css';
import './canvas.css'

// Get Images
import AND from './images/AND.svg';
import OR from './images/OR.svg';
import NOT from './images/NOT.svg';
import XOR from './images/XOR.svg';
import NOR from './images/NOR.svg';
import NAND from './images/NAND.svg';
import XNOR from './images/XNOR.svg';
import UNDO from './images/UNDO.png';
import REDO from './images/REDO.png';
import RESET from './images/RESET.png';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // circuit: {}
            circuit: {
                "component": {
                    "inputs": [
                        {
                            "name": "x",
                            "type": "static",
                            "value": true
                        },
                        {
                            "name": "y",
                            "type": "placeholder"
                        }
                    ],
                    "gates": [
                        {
                            "name": "xnor",
                            "type": "xnor",
                            "inputs": ["x", "y"]
                        }

                    ],
                    "outputs": [
                        {
                            "name": "o1",
                            "type": "static",
                            "inputs": ["xnor"]
                        }
                    ]
                }
            }
        };

        // Bind functions to this
        this.draw = this.draw.bind(this);
        this.mouseZoom = this.mouseZoom.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.openDrawer = this.openDrawer.bind(this);

        // Define variables
        this.zoom = 50;
        this.offset = {
            x: 0,
            y: 0
        };
        this.mouse = {
            grid: { // Position on grid
                x: 0,
                y: 0
            },
            screen: { // Position on screen
                x: 0,
                y: 0
            }
        };
        this.settings = { // Various flags
            scrollAnimation: true,
            zoomAnimation: true
        };
        this.scrollAnimation = {
            v: 0, // Velocity
            r: 0, // Rate
            animate: false // Animation flag
        };
        this.zoomAnimation = this.zoom;

        // Helpers
        this.wheel = null; // Mouse wheel usage (not functioning)
        this.selecting = null;
        this.dragging = null;
        this.connecting = null;
        this.animFrameID = null;

        // List of Items on Canvas
        this.items = [
            {
                type: "and",
                location: {
                    corner: {
                        x: 0,
                        y: 0
                    },
                    width: 2
                },
                inputs: {
                    num: 2,
                    map: []
                }
            },
            {
                type: "or",
                location: {
                    corner: {
                        x: 10,
                        y: 2
                    },
                    width: 2
                },
                inputs: {
                    num: 2,
                    map: []
                }
            }
        ];
    }

    gridToPixel(x, y) {     //Takes in a position on the grid and returns the pixel for it.
        return { 
            x: (x - this.offset.x) * this.zoom, 
            y: (y + this.offset.y) * this.zoom
        }
        
    }

    // Draw the Canvas and Elements on it
    draw() {
        const canvas = this.refs.background // Grab the actual canvas element by reference
        const ctx = canvas.getContext("2d") // Create drawing object (context)

        // Initialize context data
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw dots
        // if (this.zoom > 24) {
        // Initialize context fill style
        ctx.fillStyle = "rgba(200,200,200," + Math.min(1, this.zoom / 100) + ")";
        // ctx.strokeStyle = "rgba(0,0,200," + Math.min(1, this.zoom / 100) + ")";

        // Draw small dots (boxes) or lines at intervals based on the zoom level
        for (let i = (-this.offset.x * this.zoom) % this.zoom; i < canvas.width; i += this.zoom) {
            for (let j = (this.offset.y * this.zoom) % this.zoom; j < canvas.height; j += this.zoom) {
                ctx.fillRect(i - this.zoom / 24, j - this.zoom / 24, this.zoom / 12, this.zoom / 12);
            }
        }

        ctx.strokeStyle = "rgba(50,50,50,100)";
        ctx.strokeRect(
            (this.mouse.grid.x - this.offset.x) * this.zoom,
            (-this.mouse.grid.y + this.offset.y) * this.zoom,
            (1 * this.zoom),
            (1 * this.zoom)
        );

        // Iterate through all elements in the "items" list
        for (let i = 0; i < this.items.length; ++i) {
            // Get screen location for item
            let comp = this.items[i];
            let location = this.gridToPixel(comp.location.corner.x, comp.location.corner.y);

            // Initialize drawing styles
            ctx.strokeStyle = "rgba(50,50,50,100)";
            ctx.lineWidth = this.zoom/10;
            ctx.fillStyle = "rgba(150,150,150,255)";

            // Draw and fill bounding box
            ctx.fillRect(
                location.x + this.zoom/2,
                location.y + this.zoom/2,
                (comp.location.width * this.zoom),
                (comp.inputs.num * this.zoom)
            );
            ctx.strokeRect(
                location.x + this.zoom/2,
                location.y + this.zoom/2,
                (comp.location.width * this.zoom),
                (comp.inputs.num * this.zoom)
            );

            // Draw output node
            ctx.beginPath();
            ctx.moveTo(
                location.x + this.zoom/2 + (comp.location.width) * this.zoom,
                location.y + this.zoom/2 + (1/2) * this.zoom
            );
            ctx.lineTo(
                location.x + this.zoom/2 + (comp.location.width) * this.zoom + this.zoom/2,
                location.y + this.zoom/2 + (1/2) * this.zoom
            );
            ctx.stroke();

            // Draw output node part 2
            ctx.lineWidth = this.zoom/20;
            ctx.fillStyle = "rgba(150,150,150,255)";
            ctx.beginPath();
            ctx.arc(
                location.x + this.zoom/2 + (comp.location.width) * this.zoom + this.zoom/2,
                location.y + this.zoom/2 + (1/2) * this.zoom,
                this.zoom/10,
                0,
                2*Math.PI
            );
            ctx.fill();
            ctx.stroke();

            // Draw input nodes
            for (let j = 0; j < comp.inputs.num; ++j) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(50,50,50,100)";
                ctx.lineWidth = this.zoom/10;
                ctx.fillStyle = "rgba(150,150,150,255)";
                ctx.moveTo(
                    location.x + this.zoom/2,
                    location.y + (this.zoom * (j+1))
                );
                ctx.lineTo(
                    location.x,
                    location.y + (this.zoom * (j+1))
                );
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = "rgba(150,150,150,255)";
                ctx.lineWidth = this.zoom/20;
                ctx.arc(
                    location.x,
                    location.y + (this.zoom * (j+1)),
                    this.zoom/10,
                    0,
                    2*Math.PI
                );
                ctx.fill();
                ctx.stroke();
            }

            // Draw label of node
            ctx.fillStyle = "rgba(0,0,0,255)";
            ctx.lineWidth = 5;
            ctx.font = "900 " + this.zoom/3 + "px Arial";
            ctx.fillText(this.items[i].type, location.x + this.zoom, location.y + this.zoom);
        }
        
        // console.log(this.zoom);
        // console.log(this.mouse.grid, this.offset);

        // Draw lines based on zoom level
        // for (let i = (-this.offset.x * this.zoom) % this.zoom; i < canvas.width; i += this.zoom) {
        //     ctx.beginPath();
        //     ctx.moveTo(i - this.zoom/24, 0);
        //     ctx.lineTo(i - this.zoom/24, canvas.height);
        //     ctx.stroke();
        // }
        // for (let j = (this.offset.y * this.zoom) % this.zoom; j < canvas.height; j += this.zoom) {
        //     ctx.beginPath();
        //     ctx.moveTo(0, j - this.zoom/24);
        //     ctx.lineTo(canvas.width, j - this.zoom/24);
        //     ctx.stroke();
        // }
        // }

        // Define line styles based on zoom level (For Later)
        if (this.zoom > 50) {
            ctx.lineJoin = "round";
        } else {
            ctx.lineJoin = "miter";
        }


        // Handle scrolling animation
        if (this.settings.scrollAnimation) {
            if (this.scrollAnimation.animate && this.settings.scrollAnimation) { // If animation flags are up
                this.offset.x -= Math.sin(this.scrollAnimation.r) * this.scrollAnimation.v; // Modify x offset by function of rate and velocity
                this.offset.y += Math.cos(this.scrollAnimation.r) * this.scrollAnimation.v; // Modify y offset by function of rate and velocity

                this.scrollAnimation.v -= this.scrollAnimation.v / 16; // Reduce velocity by 1/16
                if (this.scrollAnimation.v <= 0.001) { // If velocity falls below a threshold
                    this.scrollAnimation.animate = false; // Deactivate flag
                }
            }
        }

        // Handle zooming animation
        if (this.settings.zoomAnimation) { // If animation flag is up
            this.offset.x += this.mouse.screen.x * (1 / this.zoom - 8 / (this.zoomAnimation + 7 * this.zoom)); // Modify x offset wrt mouse position and zoom/zoomAnimation levels
            this.offset.y -= this.mouse.screen.y * (1 / this.zoom - 8 / (this.zoomAnimation + 7 * this.zoom)); // Modify y offset wrt mouse position and zoom/zoomAnimation levels
            this.zoom = this.zoom - (this.zoom - this.zoomAnimation) / 8; // Modify zoom level
        } else {
            this.offset.x = (this.offset.x + this.mouse.screen.x * (1 / this.zoom - 1 / (this.zoomAnimation))); // See above
            this.offset.y = (this.offset.y + this.mouse.screen.y * (1 / this.zoom - 1 / (this.zoomAnimation))); // See above
            this.zoom = this.zoomAnimation;
        }

        // Request redraw to canvas
        this.animFrameID = window.requestAnimationFrame(this.draw);
    }

    // Scroll method for recentering with keys/buttons (To be implemented later)
    // scroll(deltaX, deltaY) {
    //     if (this.settings.scrollAnimation) {
    //         this.scrollAnimation.v = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) / 16;
    //         this.scrollAnimation.r = Math.atan2(-deltaX, deltaY);
    //         this.scrollAnimation.animate = true;
    //     } else {
    //         this.offset.x += deltaX;
    //         this.offset.y += deltaY;
    //     }

    //     this.mouse.grid.x += deltaX;
    //     this.mouse.grid.y += deltaY;
    // }

    // Zoom method for zoomingn with keys/buttons (To be implemented later)
    // changeZoom(delta) {
    //     this.zoomAnimation = Math.min(
    //         Math.max(
    //             this.zoomAnimation + delta,
    //             2),
    //         300
    //     );
    // }

    /* 
    **  Event Listeners
    **  Functions attached to different events and interactions with the canvas
    */
    mouseZoom(e) {
        e.preventDefault();

        // Get mouse info from event data
        this.mouse.screen.x = e.x;
        this.mouse.screen.y = e.y;
        this.mouse.grid.x = Math.floor(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.ceil(-e.y / this.zoom + this.offset.y);

        // Set the zoomAnimation info (used in draw())
        this.zoomAnimation = Math.min(
            Math.max(
                this.zoomAnimation - this.zoom / 8 * ((e.deltaX || e.deltaY) > 0 ? .5 : -1),
                2),
            300
        );

        // return false;
    }

    mouseDown(e) {
        const canvas = this.refs.background; // Grab canvas from DOM
        canvas.focus(); // Put canvas into focus (not necessary now, maybe later?)

        // Get mouse info from event data
        this.mouse.screen.x = e.x;
        this.mouse.screen.y = e.y;
        this.mouse.grid.x = Math.floor(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.ceil(-e.y / this.zoom + this.offset.y);
        console.log(this.mouse.grid.x, this.mouse.grid.y);

        // XXX For whatever reason, without clicking, the event.which default value is 1,
        //     instead of 0. Right now, dragging can only be done by holding ctrl. So, this
        //     listener doesn't do anything at the moment - it does not trigger mouseMove,
        //     which triggers by default when pressing ctrl, so no data is actually passed
        //     from mouseDown.
        if (e.which === 1) { // Left-Click
            if (e.ctrlKey) { // See above. Without this, the canvas will drag on any mouse movement.
                // Grab x and y coordinates from canvas
                // let x = this.mouse.screen.x / this.zoom + this.offset.x;
                // let y = -this.mouse.screen.y / this.zoom + this.offset.y;

                // this.scrollAnimation.animate = false; // Deactivate scrolling flag
            } else {

            }
        }
    }

    mouseMove(e) {
        // Get mouse info from event data
        this.mouse.screen.x = e.x;
        this.mouse.screen.y = e.y;
        this.mouse.grid.x = Math.floor(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.ceil(-e.y / this.zoom + this.offset.y);

        if (e.which === 1) { // Left-Click
            if (e.ctrlKey) {
                e.preventDefault(); // Protect from default event data (no jarring zooms or scrolls)

                this.offset.x -= e.movementX / this.zoom; // Change canvas x offset based on event and zoom
                this.offset.y += e.movementY / this.zoom; // Change canvas y offset based on event and zoom

                this.scrollAnimation.v = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)) / this.zoom; // Set velocity as function of root of sum of squares, scaled by zoom
                this.scrollAnimation.r = Math.atan2(e.movementX, e.movementY); // Set rate

                return false;
            }
        }
    }

    mouseUp(e) {
        // Get mouse info from event data
        this.mouse.screen.x = e.x;
        this.mouse.screen.y = e.y;
        this.mouse.grid.x = Math.floor(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.ceil(-e.y / this.zoom + this.offset.y);

        // XXX Like mouseDown, this function doesn't actually do anything after mouseMove due to the
        //     defauly event.which value being 1, not 0. Will adress this later.
        if (e.which === 1 && e.ctrlKey) {
            this.scrollAnimation.animate = false;
        }
    }

    openDrawer(e) {
        e.srcElement.classList.toggle("active");
        var content = e.srcElement.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }

    dragStart(e) {
        console.log("dragging");
        console.log(e.clientX);
    }

    dragEnd(e) {
        this.mouse.screen.x = e.x;
        this.mouse.screen.y = e.y;
        this.mouse.grid.x = Math.floor(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.ceil(-e.y / this.zoom + this.offset.y);
        console.log("drag ended");
        console.log(e.clientX, e.clientY);
        console.log(this.mouse.screen.x, this.mouse.screen.y);
        console.log(this.mouse.grid.x, this.mouse.grid.y);
    }

    /* 
    **  Mount this Component
    **  Initialize listeners and call draw()
    */
    componentDidMount() {
        const canvas = this.refs.background; // Grab the actual canvas element by reference

        // Attach event listeners
        canvas.addEventListener('wheel', this.mouseZoom);       // Mouse wheel zooming
        canvas.addEventListener('mousedown', this.mouseDown);   // Mouse click - interacting with components, dragging screen
        canvas.addEventListener('mousemove', this.mouseMove);   // Mouse movement - dragging components, dragging screen
        canvas.addEventListener('mouseup', this.mouseUp);       // Mouse up - dragging screen

        const collapsibles = document.getElementsByClassName("collapsible");
        for (let i = 0; i < collapsibles.length; ++i) {
            collapsibles[i].addEventListener('click', (i) => this.openDrawer(i));
        }

        const gates = document.getElementsByClassName("gate");
        for (let i = 0; i < gates.length; ++i) {
            console.log("adding event listener");
            gates[i].addEventListener('dragstart', (i) => this.dragStart(i));
            //gates[i].addEventListener('drag', (i) => this.dragHandler(i));
            gates[i].addEventListener('dragend', (i) => this.dragEnd(i));
        }

        // Make call to draw() method
        this.draw();
    }

    componentWillUnmount() {
        // Cancel the animation loop for canvas
        window.cancelAnimationFrame(this.animFrameID);

        // Pass the circuit up to parent
        this.props.getCircuit(this.state.circuit);
    }


    render() {
        return (
            <div>
                {/*Menus sidebar*/}
                <div class="sidenav">
                    <div>
                        <button type="button" class="io">Export</button>

                        <button type="button" class="io">Upload</button>

                        <button type="button" class="collapsible">Inputs</button>
                        <div class="content">
                            <p>Inputs</p>
                        </div>

                        <button type="button" class="collapsible">Gates</button>
                        <div class="content">

			    <div class="tooltip"> 
                            <div class="gate"> 
				AND Gate
                                <img src={AND} alt="And" height="25" width="40">
                                </img>
				<span class="tooltiptext"> 
				Returns true if both inputs are true, false otherwise
				</span> 
		            </div>
                            </div>

			    <p>  </p> {/*newline to seperate gates*/}

			    <div class="tooltip"> 
                            <div class="gate">
                                 OR Gate
                                 <img src={OR} alt="Or" height="25" width="40">
                                 </img>
				<span class="tooltiptext"> 
				Returns true if one input is true, false if neither are true
				</span>  
                            </div>
                            </div>

			    <p>  </p> {/*newline to seperate gates*/}

			    <div class="tooltip"> 
                            <div class="gate">
                                NOR Gate
                                <img src={NOR} alt="Nor" height="25" width="40">
                                </img>
				<span class="tooltiptext"> 
				Returns true if both inputs are false, false otherwise
				</span>  
                            </div>
                            </div>

			    <p>  </p> {/*newline to seperate gates*/}

			    <div class="tooltip"> 
                            <div class="gate">
                                XOR Gate
                                <img src={XOR} alt="Xor" height="25" width="40">
                                </img>
				<span class="tooltiptext"> 
				Returns true if an odd number ofinputs are true, false otherwise
				</span>  
                            </div>
                            </div>

			    <p>  </p> {/*newline to seperate gates*/}

			    <div class="tooltip"> 
                            <div class="gate">
                                NAND Gate
                                <img src={NAND} alt="Nand" height="25" width="40">
                                </img>
				<span class="tooltiptext"> 
				Returns false if both inputs are true, true otherwise
				</span>  
                            </div>
                            </div>

			    <p>  </p> {/*newline to seperate gates*/}

			    <div class="tooltip"> 
                            <div class="gate">
                                NOT Gate
                                <img src={NOT} alt="Not" height="25" width="40">
                                </img>
				<span class="tooltiptext"> 
				Returns true if input is false and false if input is true
				</span>  
                            </div>
                            </div>

			    <p>  </p> {/*newline to seperate gates*/}

			    <div class="tooltip"> 
                            <div class="gate">
                                XNOR Gate
                                <img src={XNOR} alt="Xnor" height="25" width="40">
                                </img>
				<span class="tooltiptext"> 
				Returns false if one input is true and false otherwise
				</span>  
                            </div>
                            </div>
                        </div>

                        <button type="button" class="collapsible">Outputs</button>
                        <div class="content">
                            <p> Outputs </p>
                        </div>
                        <button type="button" class="collapsible">Miscellaneous</button>
                        <div class="content">
                            <p>Miscellaneous</p>
                        </div>
                    </div>

                    <div>
                        <Link to={{
                            pathname: './logic',
                            state: {
                                circuit: this.state.circuit
                            }
                        }}>
                            <button type="button" class="sidenav-link">See Logic...</button>
                        </Link>
                    </div>
                </div>

		<div class="undo">
		    <button type="button"> 
                    <img src={UNDO} alt="Undo" height="25" width="30">
		    </img>
		    </button>
		</div>

		<div class="redo">
		    <button type="button"> 
                    <img src={REDO} alt="Redo" height="25" width="30">
		    </img>
		    </button>
		</div>

		<div class="reset">
		    <button type="button"> 
                    <img src={RESET} alt="Reset" height="25" width="30">
		    </img>
		    </button>
		</div>



                {/*Components tab*/}
                <div class="comptab">
                    <button type="button" class="collapsible">Components</button>
                    <div class="content">
                        <p>Components</p>
                    </div>
                </div>

                {/*Minimap*/}
                <div>
                    <Minimap selector=".area">

                        <canvas
                            class="area"
                            ref="background"
                            width={window.innerWidth} // XXX Cleaner way to fit canvas to screen?
                            height={window.innerHeight}
                            style={{ border: '1px solid #000000' }}
                        ></canvas>
                    </Minimap>
                </div>
            </div>
        )
    }
}

export default Canvas;
