import React, { Component } from 'react';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import ReactDrawer from 'react-drawer';
import Minimap from 'react-minimap';
import MetisMenu from 'react-metismenu';
import './react-metismenu-standart.css';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import reactDrawer from 'react-drawer';

const content=[
	{
		icon: 'icon-class-name',
		label: 'MENU',
		to: '#a-link',
	
	},
	{
		icon: 'icon-class-name',
		label: 'Components',
		content: [
			{
			icon: 'icon-class-name',
			label: 'sub menu item 1.0',
			to: '#other-link',
			},
			{
			icon: 'icon-class-name',
			label: 'sub menu item 2.0',
			to: '#other-link',
			},
			
		],
	},
];


class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Do we even need state variables yet?
        };

        // Bind functions to this
        this.draw = this.draw.bind(this);
        this.mouseZoom = this.mouseZoom.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);

        // Define variables
        this.zoom = 100;
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
    }

    // Draw the Canvas and Elements on it
    draw() {
        const canvas = this.refs.background // Grab the actual canvas element by reference
        const ctx = canvas.getContext("2d") // Create drawing object (context)

        // console.log("DIM: ", canvas.height, canvas.width);
        // console.log("SCROLL", this.settings.scrollAnimation, this.scrollAnimation.v, this.scrollAnimation.r, this.scrollAnimation.animate);
        // console.log("ZOOM: ", this.settings.zoomAnimation, this.zoom, this.zoomAnimation);

        // Initialize context data
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw dots
        // if (this.zoom > 24) {
            // Initialize context fill style
            ctx.fillStyle = "rgba(0,0,200," + Math.min(1, this.zoom / 100) + ")";
            // ctx.strokeStyle = "rgba(0,0,200," + Math.min(1, this.zoom / 100) + ")";
            
            // Draw small dots (boxes) or lines at intervals based on the zoom level
            for (let i = (-this.offset.x * this.zoom) % this.zoom; i < canvas.width; i += this.zoom) {
                for (let j = (this.offset.y * this.zoom) % this.zoom; j < canvas.height; j += this.zoom) {
                    ctx.fillRect(i - this.zoom / 24, j - this.zoom / 24, this.zoom / 12, this.zoom / 12);
                }
            }

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
        window.requestAnimationFrame(this.draw);
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
        this.mouse.grid.x = Math.round(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.round(-e.y / this.zoom + this.offset.y);

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
        this.mouse.grid.x = Math.round(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.round(-e.y / this.zoom + this.offset.y);

        console.log("mousedwn", e.which, e.ctrlKey);

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
        this.mouse.grid.x = Math.round(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.round(-e.y / this.zoom + this.offset.y);

        console.log("mousemv", e.which, e.ctrlKey);

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
        this.mouse.grid.x = Math.round(e.x / this.zoom + this.offset.x);
        this.mouse.grid.y = Math.round(-e.y / this.zoom + this.offset.y);

        // XXX Like mouseDown, this function doesn't actually do anything after mouseMove due to the
        //     defauly event.which value being 1, not 0. Will adress this later.
        if (e.which === 1 && e.ctrlKey) {
            this.scrollAnimation.animate = false;
        }
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

        // Make call to draw() method
        this.draw();
    }


    render() {
        return (
	    /*
            <div>
<<<<<<< Updated upstream
		<MetisMenu content={content} activeLinkFromLocation />
		{/*	<SideNav expanded="true">
        
		<SideNav.Toggle />
		<SideNav.Nav>
                    <NavItem>
                        <NavText>Hello</NavText>
                    </NavItem>
		    <NavItem>
			<NavText> Component 2 </NavText>
		    </NavItem>
		    <NavItem>
			<div className = "menu">
			<button> Component 1 </button>
			<button> Component 2 </button>
			<button> Component 3 </button>
			<button> Component 4 </button>
		    </div>
		    </NavItem>
                    <NavItem>
                        <reactDrawer
                            open="false"
                            position="right"
                        >
                            <i onClick={() => {this.open="true"}}></i>
                            <h2> WHAT </h2>
                        </reactDrawer>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
		*/}
	<div>
	<Minimap selector=".card">
		width={window.innerWidth-5}
		height={window.innerHeight-200}
	    <div className="card">
	    	<h1>Name</h1>
	    	</div>
	    <div className="card">
	    	<h1>Title 2</h1>
	    	<div className="card">
	    		<h1> Titles never rendered by Minimap ~*~*~*~*~*~*~*~ </h1>
	    	</div>
	    </div>
	    </Minimap>
	</div>
		<canvas 
                ref="background"
                width={window.innerWidth - 2} // XXX Cleaner way to fit canvas to screen?
                height={window.innerHeight - 7}
                style={{border: '1px solid #000000'}}
            ></canvas>
=======
                <div class="sidenav">
                <button type="button" class="collapsible">Inputs</button>
                    <div class="content">
                        <p> Inputs </p>
                    </div>
                <button type="button" class="collapsible">Gates</button>
                    <div class="content">
                        <p> Gates </p>
                    </div>
                <button type="button" class="collapsible">Outputs</button>
                    <div class="content">
                        <p> Outpus </p>
                    </div>
                </div>
              */
<div>
                <div class="sidenav">
                <button type="button" class="collapsible">Inputs</button>

                <button type="button" class="collapsible">Gates</button>

                    <div class="content">
		    	<div class="gate" id="And" draggable="true" ondragstart="dragStart(event)">
                        <p> AND Gate
                        <img src="https://circuitverse.org/img/AndGate.svg" alt="And" height="25" width="40">
                        </img>
                        </p>
			</div>
		    	<div class="gate">
                        <p> OR Gate
                        <img src="https://circuitverse.org/img/OrGate.svg" alt="Or" height="25" width="40">
                        </img>
                        </p>
			</div>
		    	<div class="gate">
                        <p> NOR Gate
                        <img src="https://circuitverse.org/img/NorGate.svg" alt="Nor" height="25" width="40">
                        </img>
                        </p>
			</div>
		    	<div class="gate">
                        <p> XOR Gate
                        <img src="https://circuitverse.org/img/XorGate.svg" alt="Xor" height="25" width="40">
                        </img>
                        </p>
			</div>
		    	<div class="gate">
                        <p> NAND Gate
                        <img src="https://circuitverse.org/img/NandGate.svg" alt="Nand" height="25" width="40">
                        </img>
                        </p>
			</div>
		    	<div class="gate">
                        <p> NOT Gate
                        <img src="https://circuitverse.org/img/NotGate.svg" alt="Not" height="25" width="40">
                        </img>
                        </p>
			</div>
                     </div>

                <button type="button" class="collapsible">Outputs</button>
                    <div class="content">
                        <p> Outpus </p>
                    </div>
                </div>


                <div>
                    <Minimap selector=".area">
                        width={window.innerWidth-5}
                        height={window.innerHeight-200}
                        
                        {/*<div className="card">
                            <h1>Name</h1>
                            </div>
                        <div className="card">
                            <h1>Title 2</h1>
                            <div className="card">
                                <h1> Titles never rendered by Minimap ~*~*~*~*~*~*~*~ </h1>
                            </div>
                        </div> */}

                        <canvas 
                        class="area"
                            ref="background"
                            width={window.innerWidth - 2} // XXX Cleaner way to fit canvas to screen?
                            height={window.innerHeight - 7}
                            style={{border: '1px solid #000000'}}
                        ></canvas>
                    </Minimap>
                </div>
>>>>>>> Stashed changes
            </div>
        )
    }
}

export default Canvas;
