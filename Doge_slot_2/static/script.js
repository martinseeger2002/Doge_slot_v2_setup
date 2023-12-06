document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('slot-machine-container');
    const icons = [
        "reel_icon_1.png", "reel_icon_2.png", "reel_icon_3.png", 
        "reel_icon_4.png", "reel_icon_5.png", "reel_icon_6.png", 
        "reel_icon_7.png", "reel_icon_8.png", "reel_icon_9.png"
    ];

    // Declare the reel icons at a broader scope
    let reel1Icons = [];
    let reel2Icons = [];
    let reel3Icons = [];
    let reel4Icons = [];
    let reel5Icons = [];
    let stopReel1; // Declare this at the top level of your script
    let stopReel2;
    let stopReel3;
    let stopReel4;
    let stopReel5;
    let globalReelResults = [];
    let credits = 0; // Corrected the variable name from 'cretits' to 'credits'
    let win = 0;
    let bet = 3;
    let inProgress = false;
    let slotAddress = 'none';
    let flaskIp = window.location.href;


    function createRulesButton() {
        const rulesButton = document.createElement('button');
        rulesButton.textContent = 'Rules';
        rulesButton.style.width = '160px';
        rulesButton.style.height = '55px';
        rulesButton.style.position = 'absolute';
        rulesButton.style.left = '840px';
        rulesButton.style.top = '15px';
        rulesButton.style.backgroundColor = 'transparent';
        rulesButton.style.color = 'transparent';
        rulesButton.style.fontSize = '20px';
        rulesButton.style.border = 'none';
        rulesButton.style.borderRadius = '5px';
        rulesButton.style.zIndex = 4;

        rulesButton.style.cursor = 'pointer';
        container.appendChild(rulesButton);

        rulesButton.addEventListener('click', function() {
            toggleRulesImage();
        });
    }

    function updateSlotAddress() {
        fetch('/get-slot-address')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.json();
            })
            .then(data => {
                slotAddress = data.slot_address;
                console.log('Updated slot address:', slotAddress);
                // Additional code to handle the updated slot address
            })
            .catch(error => {
                console.error('Failed to update slot address:', error);
            });
    }

    function toggleRulesImage() {
        let rulesImage = document.getElementById('rulesImage');
        if (rulesImage) {
            rulesImage.remove();
        } else {
            rulesImage = document.createElement('img');
            rulesImage.id = 'rulesImage';
            rulesImage.src = '/static/images/rules.png';
            rulesImage.style.width = '680px';
            rulesImage.style.height = '383px';
            rulesImage.style.position = 'absolute';
            rulesImage.style.left = '172px';
            rulesImage.style.top = '119px';
            rulesImage.style.zIndex = 4; // Corrected case
    
            container.appendChild(rulesImage);
        }
    }
    

    function createSixBetLight() {
        const sixBetLight = document.createElement('div');
        sixBetLight.id = 'sixBetLight';
        sixBetLight.style.width = '101px';
        sixBetLight.style.height = '62px';
        sixBetLight.style.position = 'absolute';
        sixBetLight.style.left = '600px';
        sixBetLight.style.top = '160px';
        sixBetLight.style.zIndex = 4;
        container.appendChild(sixBetLight);
    }
    
    function createNineBetLight() {
        const nineBetLight = document.createElement('div');
        nineBetLight.id = 'nineBetLight';
        nineBetLight.style.width = '101px';
        nineBetLight.style.height = '62px';
        nineBetLight.style.position = 'absolute';
        nineBetLight.style.left = '707px';
        nineBetLight.style.top = '160px';
        nineBetLight.style.zIndex = 4;
        container.appendChild(nineBetLight);
    }

    function createSixBetDimmer() {
        const sixBetDimmer = document.createElement('div');
        sixBetDimmer.id = 'sixBetDimmer';
        sixBetDimmer.style.width = '100px';
        sixBetDimmer.style.height = '200px';
        sixBetDimmer.style.position = 'absolute';
        sixBetDimmer.style.left = '601px';
        sixBetDimmer.style.top = '194px';
        sixBetDimmer.style.zIndex = 2;
        sixBetDimmer.style.backgroundColor = 'rgba(0, 0, 0, .75)'; // Semi-transparent background
        sixBetDimmer.style.display = 'block'; // Initially hidden
        container.appendChild(sixBetDimmer);
    }

    function createNineBetDimmer() {
        const nineBetDimmer = document.createElement('div');
        nineBetDimmer.id = 'nineBetDimmer';
        nineBetDimmer.style.width = '100px';
        nineBetDimmer.style.height = '200px';
        nineBetDimmer.style.position = 'absolute';
        nineBetDimmer.style.left = '709px';
        nineBetDimmer.style.top = '194px';
        nineBetDimmer.style.zIndex = 2;
        nineBetDimmer.style.backgroundColor = 'rgba(0, 0, 0, .75)'; // Semi-transparent background
        nineBetDimmer.style.display = 'block'; // Initially hidden
        container.appendChild(nineBetDimmer);
    }

    function createBetDisplay() {
        // Create a new div element for displaying win
        const betDisplay = document.createElement('div');
    
        // Set styles for the credits display
        betDisplay.style.width = '40px';
        betDisplay.style.height = '40px';
        betDisplay.style.position = 'absolute';
        betDisplay.style.left = '585px'; // Position from the left
        betDisplay.style.top = '510px'; // Position from the top
        betDisplay.style.backgroundColor = 'black'; // Background color
        betDisplay.style.color = 'white'; // Text color
        betDisplay.style.textAlign = 'center'; // Center align text
        betDisplay.style.lineHeight = '40px'; // Vertically center text within the div
        betDisplay.style.borderRadius = '5px'; // Optional, for rounded corners
        betDisplay.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)'; // Optional, for a slight shadow
        betDisplay.style.fontSize = '18px'; // Font size of the text
        betDisplay.style.fontWeight = 'bold'; // Font weight of the text
        betDisplay.style.zIndex = '1'; // Setting z-index to 3
    
        // Set the initial win value
        betDisplay.textContent = `${bet}`;
        betDisplay.id = 'bet'; // Assign an ID for easy reference
    
        // Append the win display to the container
        const container = document.getElementById('slot-machine-container');
        if (container) {
            container.appendChild(betDisplay);
        } else {
            console.error('Container element not found');
        }
    }

    function createCreditsDisplay() {
        // Create a new div element for displaying credits
        const creditsDisplay = document.createElement('div');
    
        // Set styles for the credits display
        creditsDisplay.style.width = '100px';
        creditsDisplay.style.height = '40px';
        creditsDisplay.style.position = 'absolute';
        creditsDisplay.style.left = '420px'; // Position from the left
        creditsDisplay.style.top = '510px'; // Position from the top
        creditsDisplay.style.backgroundColor = 'black'; // Background color
        creditsDisplay.style.color = 'white'; // Text color
        creditsDisplay.style.textAlign = 'center'; // Center align text
        creditsDisplay.style.lineHeight = '40px'; // Vertically center text within the div
        creditsDisplay.style.borderRadius = '5px'; // Optional, for rounded corners
        creditsDisplay.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)'; // Optional, for a slight shadow
        creditsDisplay.style.fontSize = '18px'; // Font size of the text
        creditsDisplay.style.fontWeight = 'bold'; // Font weight of the text
        creditsDisplay.style.zIndex = '1'; // Setting z-index to 3
    
        // Set the initial credits value
        creditsDisplay.textContent = `${credits}`;
        creditsDisplay.id = 'credits'; // Assign an ID for easy reference
    
        // Append the credits display to the container
        const container = document.getElementById('slot-machine-container');
        if (container) {
            container.appendChild(creditsDisplay);
        } else {
            console.error('Container element not found');
        }
        creditsDisplay.addEventListener('click', function() {
            toggleQrCodeImage();
        });
    }

    function createCreditsButton() {
        // Create a new div element for the button
        const creditsButton = document.createElement('div');
    
        // Set styles for the button
        creditsButton.style.width = '100px';
        creditsButton.style.height = '40px';
        creditsButton.style.position = 'absolute';
        creditsButton.style.left = '420px'; // Position from the left
        creditsButton.style.top = '510px'; // Position from the top
        creditsButton.style.backgroundColor = 'transparent'; // Background color
        creditsButton.style.color = 'transparent'; // Text color
        creditsButton.style.textAlign = 'center'; // Center align text
        creditsButton.style.lineHeight = '40px'; // Vertically center text within the div
        creditsButton.style.borderRadius = '5px'; // Rounded corners
        creditsButton.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)'; // Slight shadow
        creditsButton.style.fontSize = '18px'; // Font size
        creditsButton.style.fontWeight = 'bold'; // Font weight
        creditsButton.style.cursor = 'pointer'; // Change cursor to indicate clickable
        creditsButton.style.zIndex = '4'; // Setting z-index
        creditsButton.textContent = 'Credits'; // Button text
        creditsButton.id = 'creditsButton'; // Assign an ID for easy reference
    
        // Append the button to the container
        const container = document.getElementById('slot-machine-container');
        if (container) {
            container.appendChild(creditsButton);
        } else {
            console.error('Container element not found');
        }
    
        // Add click event listener to the button
        creditsButton.addEventListener('click', function() {
            toggleQrCodeImage();
        });
    }
    

    function createWinDisplay() {
        // Create a new div element for displaying win
        const winDisplay = document.createElement('div');
    
        // Set styles for the credits display
        winDisplay.style.width = '100px';
        winDisplay.style.height = '40px';
        winDisplay.style.position = 'absolute';
        winDisplay.style.left = '685px'; // Position from the left
        winDisplay.style.top = '510px'; // Position from the top
        winDisplay.style.backgroundColor = 'black'; // Background color
        winDisplay.style.color = 'white'; // Text color
        winDisplay.style.textAlign = 'center'; // Center align text
        winDisplay.style.lineHeight = '40px'; // Vertically center text within the div
        winDisplay.style.borderRadius = '5px'; // Optional, for rounded corners
        winDisplay.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)'; // Optional, for a slight shadow
        winDisplay.style.fontSize = '18px'; // Font size of the text
        winDisplay.style.fontWeight = 'bold'; // Font weight of the text
        winDisplay.style.zIndex = '1'; // Setting z-index to 3
    
        // Set the initial win value
        winDisplay.textContent = `${win}`;
        winDisplay.id = 'win'; // Assign an ID for easy reference
    
        // Append the win display to the container
        const container = document.getElementById('slot-machine-container');
        if (container) {
            container.appendChild(winDisplay);
        } else {
            console.error('Container element not found');
        }
    }


    function displayReel1Results() {
        // Ensure globalReelResults is available and has at least one element
        if (!Array.isArray(globalReelResults) || globalReelResults.length === 0) {
            console.error('globalReelResults is not available or empty');
            return; // Exit the function if globalReelResults is not valid
        }
    
        // Clear existing icons from reel1Icons
        reel1Icons.forEach(icon => icon.remove());
        reel1Icons = [];
    
        function animateIcon(icon, topEndPosition, duration, delay) {
            setTimeout(() => {
                // Force a reflow/repaint to ensure immediate animation
                window.getComputedStyle(icon).top;
    
                // Set the transition for moving the icon
                icon.style.transition = `top ${duration} linear`;
                icon.style.top = `${topEndPosition}px`;
    
                // Remove the icon after the animation completes
                icon.addEventListener('transitionend', () => {
                }, { once: true });
            }, delay);
    
            // Add the icon to the reel1Icons array
            reel1Icons.push(icon);
        }
    
        // Animate icons with specified delays
        const fourthIcon = createIcon(68, 250);
        animateIcon(fourthIcon, 68, '1s', 975); // Start after 620ms
    
        const thirdIcon = createIcon(68, 250);
        animateIcon(thirdIcon, 158, '.3s', 650); // Start immediately158, '.45s', 620

        const secondIcon = createIconFromResult(globalReelResults[0], 68, 250);
        animateIcon(secondIcon, 248, '.6s', 325); // Start after 310ms

        const firtsIcon = createIcon(68, 250);
        animateIcon(firtsIcon, 338, '.9s', 10); // Start after 620ms 

    }

    function displayReel2Results() {

    
        // Clear existing icons from reel2Icons
        reel2Icons.forEach(icon => icon.remove());
        reel2Icons = [];
    
        function animateIcon(icon, topEndPosition, duration, delay) {
            setTimeout(() => {
                // Force a reflow/repaint to ensure immediate animation
                window.getComputedStyle(icon).top;
    
                // Set the transition for moving the icon
                icon.style.transition = `top ${duration} linear`;
                icon.style.top = `${topEndPosition}px`;
    
                // Remove the icon after the animation completes
                icon.addEventListener('transitionend', () => {
                }, { once: true });
            }, delay);
    
            // Add the icon to the reel2Icons array
            reel2Icons.push(icon);
        }
    
        // Animate icons with specified delays
        const fourthIcon = createIcon(68, 369);
        animateIcon(fourthIcon, 68, '1s', 975); // Start after 620ms
    
        const thirdIcon = createIcon(68, 369);
        animateIcon(thirdIcon, 158, '.3s', 650); // Start immediately158, '.45s', 620

        const secondIcon = createIconFromResult(globalReelResults[1], 68, 369);
        animateIcon(secondIcon, 248, '.6s', 325); // Start after 310ms

        const firtsIcon = createIcon(68, 369);
        animateIcon(firtsIcon, 338, '.9s', 10); // Start after 620ms 

    }

    function displayReel3Results() {

    
        // Clear existing icons from reel3Icons
        reel3Icons.forEach(icon => icon.remove());
        reel3Icons = [];
    
        function animateIcon(icon, topEndPosition, duration, delay) {
            setTimeout(() => {
                // Force a reflow/repaint to ensure immediate animation
                window.getComputedStyle(icon).top;
    
                // Set the transition for moving the icon
                icon.style.transition = `top ${duration} linear`;
                icon.style.top = `${topEndPosition}px`;
    
                // Remove the icon after the animation completes
                icon.addEventListener('transitionend', () => {
                }, { once: true });
            }, delay);
    
            // Add the icon to the reel3Icons array
            reel3Icons.push(icon);
        }
    
        // Animate icons with specified delays
        const fourthIcon = createIcon(68, 483);
        animateIcon(fourthIcon, 68, '1s', 975); // Start after 620ms
    
        const thirdIcon = createIcon(68, 483);
        animateIcon(thirdIcon, 158, '.3s', 650); // Start immediately158, '.45s', 620

        const secondIcon = createIconFromResult(globalReelResults[2], 68, 483);
        animateIcon(secondIcon, 248, '.6s', 325); // Start after 310ms

        const firtsIcon = createIcon(68, 483);
        animateIcon(firtsIcon, 338, '.9s', 10); // Start after 620ms 

    }

    function displayReel4Results() {

    
        // Clear existing icons from reel4Icons
        reel4Icons.forEach(icon => icon.remove());
        reel4Icons = [];
    
        function animateIcon(icon, topEndPosition, duration, delay) {
            setTimeout(() => {
                // Force a reflow/repaint to ensure immediate animation
                window.getComputedStyle(icon).top;
    
                // Set the transition for moving the icon
                icon.style.transition = `top ${duration} linear`;
                icon.style.top = `${topEndPosition}px`;
    
                // Remove the icon after the animation completes
                icon.addEventListener('transitionend', () => {
                }, { once: true });
            }, delay);
    
            // Add the icon to the reel4Icons array
            reel4Icons.push(icon);
        }
    
        // Animate icons with specified delays
        const fourthIcon = createIcon(68, 605);
        animateIcon(fourthIcon, 68, '1s', 975); // Start after 620ms
    
        const thirdIcon = createIcon(68, 605);
        animateIcon(thirdIcon, 158, '.3s', 650); // Start immediately158, '.45s', 620

        const secondIcon = createIconFromResult(globalReelResults[3], 68, 605);
        animateIcon(secondIcon, 248, '.6s', 325); // Start after 310ms

        const firtsIcon = createIcon(68, 605);
        animateIcon(firtsIcon, 338, '.9s', 10); // Start after 620ms 

    }
    
    function displayReel5Results() {

    
        // Clear existing icons from reel5Icons
        reel5Icons.forEach(icon => icon.remove());
        reel5Icons = [];
    
        function animateIcon(icon, topEndPosition, duration, delay) {
            setTimeout(() => {
                // Force a reflow/repaint to ensure immediate animation
                window.getComputedStyle(icon).top;
    
                // Set the transition for moving the icon
                icon.style.transition = `top ${duration} linear`;
                icon.style.top = `${topEndPosition}px`;
    
                // Remove the icon after the animation completes
                icon.addEventListener('transitionend', () => {
                }, { once: true });
            }, delay);
    
            // Add the icon to the reel5Icons array
            reel5Icons.push(icon);
        }
    
        // Animate icons with specified delays
        const fourthIcon = createIcon(68, 711);
        animateIcon(fourthIcon, 68, '1s', 975); // Start after 620ms
    
        const thirdIcon = createIcon(68, 711);
        animateIcon(thirdIcon, 158, '.3s', 650); // Start immediately158, '.45s', 620

        const secondIcon = createIconFromResult(globalReelResults[4], 68, 711);
        animateIcon(secondIcon, 248, '.6s', 325); // Start after 310ms

        const firtsIcon = createIcon(68, 711);
        animateIcon(firtsIcon, 338, '.9s', 10); // Start after 620ms 

    }

    function reel1SpinAnimation() {
        let reel1intervalId;
    
        function animateIcon() {
            // Create icon at the upper position (68, 369)
            const icon = createIcon(68, 250);
            
            // Force a reflow/repaint to ensure immediate animation
            window.getComputedStyle(icon).top;
    
            // Set the transition for moving the icon down
            icon.style.transition = 'top 1.05s linear';
            icon.style.top = '390px'; // Move to the lower position
    
            // Remove the icon after the animation completes
            icon.addEventListener('transitionend', () => {
                icon.remove();
            }, { once: true });
        }
    
        // Start continuously animating icons
        reel1intervalId = setInterval(animateIcon, 310);
    
        // Function to stop the animation
        function stopReel1Animation() {
            clearInterval(reel1intervalId);
        }
    
        // Return the stop function to control the animation externally
        return stopReel1Animation;
    }
    
    function reel2SpinAnimation() {
        let reel2intervalId;
    
        function animateIcon() {
            // Create icon at the upper position (68, 369)
            const icon = createIcon(68, 369);
            
            // Force a reflow/repaint to ensure immediate animation
            window.getComputedStyle(icon).top;
    
            // Set the transition for moving the icon down
            icon.style.transition = 'top 1.05s linear';
            icon.style.top = '390px'; // Move to the lower position
    
            // Remove the icon after the animation completes
            icon.addEventListener('transitionend', () => {
                icon.remove();
            }, { once: true });
        }
    
        // Start continuously animating icons
        reel2intervalId = setInterval(animateIcon, 310);
    
        // Function to stop the animation
        function stopReel2Animation() {
            clearInterval(reel2intervalId);
        }
    
        // Return the stop function to control the animation externally
        return stopReel2Animation;
    }

    function reel3SpinAnimation() {
        let reel3intervalId;
    
        function animateIcon() {
            // Create icon at the upper position (68, 369)
            const icon = createIcon(68, 483);
            
            // Force a reflow/repaint to ensure immediate animation
            window.getComputedStyle(icon).top;
    
            // Set the transition for moving the icon down
            icon.style.transition = 'top 1.05s linear';
            icon.style.top = '390px'; // Move to the lower position
    
            // Remove the icon after the animation completes
            icon.addEventListener('transitionend', () => {
                icon.remove();
            }, { once: true });
        }
    
        // Start continuously animating icons
        reel3intervalId = setInterval(animateIcon, 310);
    
        // Function to stop the animation
        function stopReel3Animation() {
            clearInterval(reel3intervalId);
        }
    
        // Return the stop function to control the animation externally
        return stopReel3Animation;
    }
    
    function reel4SpinAnimation() {
        let reel4intervalId;
    
        function animateIcon() {
            // Create icon at the upper position (68, 369)
            const icon = createIcon(68, 605);
            
            // Force a reflow/repaint to ensure immediate animation
            window.getComputedStyle(icon).top;
    
            // Set the transition for moving the icon down
            icon.style.transition = 'top 1.05s linear';
            icon.style.top = '390px'; // Move to the lower position
    
            // Remove the icon after the animation completes
            icon.addEventListener('transitionend', () => {
                icon.remove();
            }, { once: true });
        }
    
        // Start continuously animating icons
        reel4intervalId = setInterval(animateIcon, 310);
    
        // Function to stop the animation
        function stopReel4Animation() {
            clearInterval(reel4intervalId);
        }
    
        // Return the stop function to control the animation externally
        return stopReel4Animation;
    }

    function reel5SpinAnimation() {
        let reel5intervalId;
    
        function animateIcon() {
            // Create icon at the upper position (68, 369)
            const icon = createIcon(68, 711);
            
            // Force a reflow/repaint to ensure immediate animation
            window.getComputedStyle(icon).top;
    
            // Set the transition for moving the icon down
            icon.style.transition = 'top 1.05s linear';
            icon.style.top = '390px'; // Move to the lower position
    
            // Remove the icon after the animation completes
            icon.addEventListener('transitionend', () => {
                icon.remove();
            }, { once: true });
        }
    
        // Start continuously animating icons
        reel5intervalId = setInterval(animateIcon, 310);
    
        // Function to stop the animation
        function stopReel5Animation() {
            clearInterval(reel5intervalId);
        }
    
        // Return the stop function to control the animation externally
        return stopReel5Animation;
    }

    function displaySlotLayout(zIndex) {
        const slotLayoutImage = document.createElement('img');
        slotLayoutImage.src = '/static/images/slot_layout.png';
        slotLayoutImage.width = 1024;
        slotLayoutImage.height = 585;
        slotLayoutImage.style.position = 'absolute';
        slotLayoutImage.style.zIndex = zIndex;
        container.appendChild(slotLayoutImage);
    }

    function initializeReel1() {
        const topPositions = [68, 158, 248, 338];
        reel1Icons = topPositions.map(topPosition => {
            return createIcon(topPosition, 250);
        });
    }

    function initializeReel2() {
        const topPositions = [68, 158, 248, 338];
        reel2Icons = topPositions.map(topPosition => {
            return createIcon(topPosition, 369);
        });
    }

    function initializeReel3() {
        const topPositions = [68, 158, 248, 338];
        reel3Icons = topPositions.map(topPosition => {
            return createIcon(topPosition, 483);
        });
    }

    function initializeReel4() {
        const topPositions = [68, 158, 248, 338];
        reel4Icons = topPositions.map(topPosition => {
            return createIcon(topPosition, 605);
        });
    }
    
    function initializeReel5() {
        const topPositions = [68, 158, 248, 338];
        reel5Icons = topPositions.map(topPosition => {
            return createIcon(topPosition, 711);
        });
    }

    function createIcon(topPosition, leftPosition) {
        const iconIndex = Math.floor(Math.random() * icons.length);
        const icon = document.createElement('img');
        icon.src = '/static/images/' + icons[iconIndex];
        icon.style.width = '90px';
        icon.style.height = '90px';
        icon.style.position = 'absolute';
        icon.style.left = `${leftPosition}px`;
        icon.style.top = `${topPosition}px`;
        icon.style.zIndex = 1;
        container.appendChild(icon);
        return icon;
    }

    function animateAndRemoveIcons(icons, transitionTimes) {
        icons.forEach((icon, index) => {
            if (icon) {
                icon.style.transition = `top ${transitionTimes[index]} linear`;
                icon.style.top = '390px';
                icon.addEventListener('transitionend', () => {
                    icon.remove();
                }, { once: true });
            }
        });
    }
    
    function createIconFromResult(result, topPosition, leftPosition) {
        const icon = document.createElement('img');
        icon.src = '/static/images/' + result; // Using the filename from reelResults
        icon.style.width = '90px';
        icon.style.height = '90px';
        icon.style.position = 'absolute';
        icon.style.left = `${leftPosition}px`;
        icon.style.top = `${topPosition}px`;
        icon.style.zIndex = 1;
        container.appendChild(icon);
        return icon;
    }

    
    function createAndAppendSpinButton(offsetX, offsetY, zIndex) {
        const spinButton = document.createElement('img');
        spinButton.src = '/static/images/spin_button.png';
        spinButton.style.width = '100px';
        spinButton.style.height = '80px';
        spinButton.style.position = 'absolute';
        spinButton.style.left = `243px`;
        spinButton.style.top = `505px`;
        spinButton.style.zIndex = 3;
        container.appendChild(spinButton);
    
        // Add click event listener to the spin button
        spinButton.addEventListener('click', function() {
            onSpinButtonClick();
        });
    }

    function createAndAppendBetButton() {
        const betButton = document.createElement('div');
        betButton.style.width = '40px';
        betButton.style.height = '40px';
        betButton.style.position = 'absolute';
        betButton.style.left = '585px'; // Position from the left
        betButton.style.top = '510px'; // Position from the top
        betButton.style.backgroundColor = 'transarent';  // Corrected the property name
        betButton.style.zIndex = 4; // Use the zIndex parameter
        container.appendChild(betButton);
    
        // Add click event listener to the bet button
        betButton.addEventListener('click', function() {
            onBetButtonClick();
        });
    
        container.appendChild(betButton);
    }
    
    function getReelResults() {
        return new Promise((resolve, reject) => {
            fetch(`${flaskIp}/get-reel-results`)
            .then(response => response.json())
            .then(data => {
                console.log('Reel Results:', data);
                globalReelResults = data; // Update the global variable
                resolve(data);
            })
            .catch(error => {
                console.error('Error fetching reel results:', error);
                reject(error);
            });
        });
    }
    

    function updateCredits() {
        return fetch(`${flaskIp}/get-credits`)
            .then(response => response.json())
            .then(data => {
                const creditsElement = document.getElementById('credits');
                if (creditsElement) {
                    creditsElement.textContent = `${data.credits}`;
                }
                return data.credits; // Return the credits value
            })
            .catch(error => {
                console.error('Error fetching credits:', error);
            });
    }
    
    function updatebet() {
        return fetch(`${flaskIp}/get-bet`)
            .then(response => response.json())
            .then(data => {
                const betElement = document.getElementById('bet');
                if (betElement) {
                    betElement.textContent = `${data.bet}`;
                }
                return data.bet; // Ensure this returns the new bet amount
            })
            .catch(error => {
                console.error('Error fetching bet:', error);
            });
    }
    
    
    function updateWin() {
        fetch(`${flaskIp}/get-win`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Full Data:', data); // Log the full data object for debugging
    
                const winElement = document.getElementById('win');
                if (winElement) {
                    // Check if data.win is not undefined
                    if (data.win !== undefined) {
                        winElement.textContent = `${data.win}`;
                    } else {
                        console.error('Win value is undefined');
                    }
                } else {
                    console.error('Win display element not found');
                }
            })
            .catch(error => {
                console.error('Error fetching win:', error);
            });
    }

    function updateWinDisplay() {
        const winDisplay = document.getElementById('win');
        if (winDisplay) {
            // Use the global 'win' variable
            winDisplay.textContent = `${win}`;
        } else {
            console.error('Win display element not found');
        }
    }

    function updateSixBetLight(betAmount) {
        const sixBetLight = document.getElementById('sixBetLight');
        if (betAmount === 6 || betAmount === 9) {
            sixBetLight.innerHTML = '<img src="/static/images/reel_light.png" alt="Bet Light">';
        } else {
            sixBetLight.innerHTML = '';
        }
    }

    function updateNineBetLight(betAmount) {
        const nineBetLight = document.getElementById('nineBetLight');
        if (betAmount === 9) {
            nineBetLight.innerHTML = '<img src="/static/images/reel_light.png" alt="Bet Light">';
        } else {
            nineBetLight.innerHTML = '';
        }
    }

    function updateSixBetDimmer(betAmount) {
        const sixBetDimmer = document.getElementById('sixBetDimmer');
        if (betAmount === 6 || betAmount === 9) {
            sixBetDimmer.style.display = 'none';
        } else {
            sixBetDimmer.style.display = 'block';
        }
    }

    function updateNineBetDimmer(betAmount) {
        const nineBetDimmer = document.getElementById('nineBetDimmer');
        if (betAmount === 9) {
            nineBetDimmer.style.display = 'none';
        } else {
            nineBetDimmer.style.display = 'block';
        }
    }

    function onSpinButtonClick() {
        if (inProgress) {            
            return; // Exit the function early
        }
        updatebet()
        if (bet === '0') {
            alert('Bet is zero');
            return;

        }
        // Fetch the latest credits and bet amounts from the server
        Promise.all([updateCredits(), updatebet()]).then(values => {
            const intCredits = parseInt(values[0]); // Credits are the first item
            const intBet = parseInt(values[1]); // Bet is the second item
            // Check if credits are less than the bet
            if (intCredits < intBet) {
                console.log('Insufficient credits to spin');
                alert('Insufficient credits to spin');
                return;
            }
        // Define different transition times for each icon
        const transitionTimes = ['1.05s', '.75s', '.45s', '.17s']; // Adjust these times as needed
        animateAndRemoveIcons(reel1Icons, transitionTimes);
        animateAndRemoveIcons(reel2Icons, transitionTimes);
        animateAndRemoveIcons(reel3Icons, transitionTimes);
        animateAndRemoveIcons(reel4Icons, transitionTimes);
        animateAndRemoveIcons(reel5Icons, transitionTimes);
    
        // Start the animations and store the stop functions
        stopReel1 = reel1SpinAnimation();
        stopReel2 = reel2SpinAnimation(); // Store the stop function
        stopReel3 = reel3SpinAnimation();
        stopReel4 = reel4SpinAnimation();
        stopReel5 = reel5SpinAnimation();
        updateCredits();
        
        getReelResults().then(() => {
            setTimeout(() => {
                stopReel1();
        
                // Adding 130ms timeout before displaying reel 1 results
                setTimeout(() => {
                    displayReel1Results();  // Pass reel results to this function
        
                    // Adding another setTimeout for a 1000ms delay
                    setTimeout(() => {
                        stopReel2();
        
                        // Adding 200ms timeout before displaying reel 2 results
                        setTimeout(() => {
                            displayReel2Results();
        
                            // Adding 1000ms delay before stopping reel 3
                            setTimeout(() => {
                                stopReel3();
        
                                // Adding 250ms delay before displaying reel 3 results
                                setTimeout(() => {
                                    displayReel3Results();
        
                                    // Adding 1000ms delay before stopping reel 4
                                    setTimeout(() => {
                                        stopReel4();
        
                                        // Adding 300ms delay before displaying reel 4 results
                                        setTimeout(() => {
                                            displayReel4Results();
        
                                            // Adding 1000ms delay before stopping reel 5
                                            setTimeout(() => {
                                                stopReel5();
        
                                                // Adding 250ms delay before displaying reel 5 results
                                                setTimeout(() => {
                                                    displayReel5Results();
                                                    // Add a new setTimeout here with a 2000ms delay
                                                    setTimeout(() => {
                                                        updateCredits();
                                                        updateWin();
                                                        inProgress = false;
                                                    }, 1000); // 2000ms delay before updating credits and win
                                                    
                                                }, 130); // 250ms delay before displaying reel 5 results
        
                                            }, 250); // 1000ms delay before stopping reel 5
        
                                        }, 120); // 300ms delay before displaying reel 4 results
        
                                    }, 250); // 1000ms delay before stopping reel 4
        
                                }, 110); // 250ms delay before displaying reel 3 results
        
                            }, 250); // 1000ms delay before stopping reel 3
        
                        }, 100); // 200ms delay before displaying reel 2 results
        
                    }, 250); // 1000ms delay after reel 2 results
        
                }, 90); // 130ms delay before displaying reel 1 results
        
            }, 100); // Initial 100ms delay


        }).catch(error => {
            console.error('Error in stopping Reel 2:', error);
        });
        
        console.log('Spin button clicked');
        inProgress = true;
        updateCredits();
        win = 0
        updateWinDisplay();
        updatebet();
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    function onBetButtonClick() {
        if (inProgress) {            
            return; // Exit the function early if a process is already in progress
        }
        fetch(`${flaskIp}/change-bet`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            // Call updatebet to update the bet display and get the new bet value
            return updatebet();
        })
        .then(newBetAmount => {
            console.log('Bet amount updated to:', newBetAmount);
            bet = newBetAmount; // Update the global bet variable
            updateNineBetLight(newBetAmount)
            updateSixBetLight(newBetAmount); // Update the sixBetLight based on the new bet amount
            updateSixBetDimmer(newBetAmount);
            updateNineBetDimmer(newBetAmount);
        })
        .catch(error => {
            console.error('Error updating bet amount:', error);
        });
    }



    function periodicallyUpdateCredits() {
        updateCredits();
        setInterval(() => {
            if (!inProgress) {
                updateCredits();
            }
        }, 1000); // 10000 milliseconds = 10 seconds
    }
    
    function toggleQrCodeImage() {
        const container = document.getElementById('slot-machine-container');
        const existingQrCodeImage = document.getElementById('qrCodeImage');
        const existingAddressBox = document.getElementById('addressBox');
        const existingMessageBox = document.getElementById('messageBox');
    
        if (existingQrCodeImage) {
            // If the QR code image exists, remove it along with the address box and message box
            container.removeChild(existingQrCodeImage);
            if (existingAddressBox) {
                container.removeChild(existingAddressBox);
            }
            if (existingMessageBox) {
                container.removeChild(existingMessageBox);
            }
        } else {
            // If the QR code image does not exist, create and append it
            const qrCodeImage = document.createElement('img');
            qrCodeImage.id = 'qrCodeImage';
            qrCodeImage.src = `/static/images/slot_qr_codes/${slotAddress}.png`;
            qrCodeImage.style.width = '300px';
            qrCodeImage.style.height = '300px';
            qrCodeImage.style.position = 'absolute';
            qrCodeImage.style.left = '380px';
            qrCodeImage.style.top = '140px';
            qrCodeImage.style.zIndex = '5';
    
            // Create and style the address box
            const addressBox = document.createElement('div');
            addressBox.id = 'addressBox';
            addressBox.textContent = slotAddress;
            addressBox.style.width = '300px';
            addressBox.style.height = '50px';
            addressBox.style.position = 'absolute';
            addressBox.style.left = '380px';
            addressBox.style.top = '440px';
            addressBox.style.backgroundColor = 'black';
            addressBox.style.color = 'yellow';
            addressBox.style.textAlign = 'center';
            addressBox.style.lineHeight = '50px';
            addressBox.style.fontSize = '12px';
            addressBox.style.fontWeight = 'bold';
            addressBox.style.border = '1px solid black';
            addressBox.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)';
            addressBox.style.zIndex = '5';
            
            const messageBox = document.createElement('div');
            messageBox.id = 'messageBox';
            messageBox.textContent = "Send DOGE for credits"
            messageBox.style.width = '300px';
            messageBox.style.height = '50px';
            messageBox.style.position = 'absolute';
            messageBox.style.left = '380px';
            messageBox.style.top = '90px';
            messageBox.style.backgroundColor = 'black';
            messageBox.style.color = 'yellow';
            messageBox.style.textAlign = 'center';
            messageBox.style.lineHeight = '50px';
            messageBox.style.fontSize = '20px';
            messageBox.style.fontWeight = 'bold';
            messageBox.style.border = '1px solid black';
            messageBox.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)';
            messageBox.style.zIndex = '5';

            if (container) {
                container.appendChild(qrCodeImage);
                container.appendChild(addressBox);
                container.appendChild(messageBox);
            } else {
                console.error('Container element not found for appending QR code image and address box');
            }
        }
    }
    
    function createCashOutButton() {
        const cashOutButton = document.createElement('button');
        cashOutButton.textContent = 'cashOut';
        cashOutButton.style.width = '160px';
        cashOutButton.style.height = '55px';
        cashOutButton.style.position = 'absolute';
        cashOutButton.style.left = '24px';
        cashOutButton.style.top = '15px';
        cashOutButton.style.backgroundColor = 'transparent';
        cashOutButton.style.color = 'transparent';
        cashOutButton.style.fontSize = '20px';
        cashOutButton.style.border = 'none';
        cashOutButton.style.borderRadius = '5px';
        cashOutButton.style.zIndex = 4;
        cashOutButton.style.cursor = 'pointer';
        container.appendChild(cashOutButton);
        
        cashOutButton.addEventListener('click', function() {
            onCashOutButtonClick();
        });    
    }
    
    function onCashOutButtonClick() {
        if (inProgress) {            
            return; // Exit the function early
        }
        // Fetch the latest credits and bet amounts from the server
        Promise.all([updateCredits(), updatebet()]).then(values => {
            const intCredits = parseInt(values[0]); // Credits are the first item
            console.log(intCredits);
            // Check if credits are less than the bet
            if (intCredits < 1) {
                console.log('Credits are 0');
                alert('Credits are 0');
                return;
            }
        fetch(`${flaskIp}/cash-out`, { 
            method: 'POST',
             headers: {
                'Content-Type': 'application/json'
            }
        })
        }).catch
    }

    // Initialize objects
    displaySlotLayout(3); // Initialize layout
    periodicallyUpdateCredits();
    updatebet();
    updateWin();
    createCreditsDisplay();
    createWinDisplay();
    createBetDisplay();
    initializeReel1(); // Initialize reel 1 icons
    initializeReel2();
    initializeReel3();
    initializeReel4();
    initializeReel5();
    createRulesButton();
    createSixBetLight();
    createNineBetLight();
    createSixBetDimmer();
    createNineBetDimmer();
    createAndAppendSpinButton(); // Position of the spin button
    createAndAppendBetButton();
    updateSlotAddress();
    createCreditsButton();
    createCashOutButton();
    console.log('Slot Address:', slotAddress);


});