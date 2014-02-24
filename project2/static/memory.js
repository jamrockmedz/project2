var flipSound;
var startSound;
var cardPack = [];
var deck = [];
var currentGame;
var q;
var numTries;
var pairedCards = [];

function attachEvent(element, type, handler)
{
    if (element.addEventListener) element.addEventListener(type, handler, false);
    else element.attachEvent("on"+type, handler);
}

attachEvent(window,"load",setup);

function setup()
{
    currentGame = document.getElementById("game");
    generateDeck();
    displayDeck();
    
    numTries = 24;
	applause = document.createElement('audio');
	boo = document.createElement('audio');
	match = document.createElement('audio');
  
	applause.setAttribute('src', 'static/applause.ogg');
	boo.setAttribute('src', 'static/boo.ogg');
	match.setAttribute('src', 'static/match.ogg');
  
	flipSound = document.createElement('audio');
	flipSound.setAttribute('src', 'static/flip_card.ogg');
	startSound = document.createElement('audio');
	startSound.setAttribute('src', 'static/finish.ogg');
	startSound.play();
	
	document.getElementById("button_holder").innerHTML = "";
	document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
	document.getElementById("flip-front").innerHTML = "<h1>Memory Card Game</h1>";
	attachEvent(document.getElementById("saveGame"), "click", saveGame);
	attachEvent(document.getElementById("saveName"), "click", saveName);
    
    
}

function saveName()
{
	var name = document.getElementById("playerName");
	//var previousName = JSON.parse(localStorage.getItem("playerName"));
	
	if(!localStorage.playerName)
	{
		alert("previousName no");
		localStorage.setItem("playerName", JSON.stringify([name.value]));
	}
	else
	{
		alert("previousName yes");
		localStorage.playerName = JSON.stringify([name.value]);
	}
	//alert(previousName);
	
}

function saveGame()
{
	alert(currentGame);
}




function changeClassName(e,c)
{
    e.className="w "+c;
}

// get out a random element from an array
function R(a)
{
    return a.splice(0|a.length*Math.random(),1)[0];
}



    /*
     * Flip the card
     *
     * We use classes to be able to count some group of cards:
     * "p" is used for "paired" cards that stay visible forever
     * "v" is used for the 1 or 2 cards that we turned on and are currently "visible"
     */
    function Flip(t)
    {
            // increase the counter and display it
        
		if(numTries > 0)
		{	
			var paired = false;
			for(var i = 0; i < pairedCards.length; i++)			
			{
				if(t == pairedCards[i] )
				{
					paired = true;
				}
			}
            
			
			if(!paired)
			{
				var visibleCards = currentGame.querySelectorAll(".v");
			
				var x = visibleCards[0];
				var y = visibleCards[1];
				
				if(visibleCards.length  == 0)
				{
					flipSound.play();
					
					changeClassName(t,"v");
					numTries--;
					document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
				}
				else if(visibleCards.length  == 1)
				{
					if(x != t)
					{
						flipSound.play();
						changeClassName(t,"v");
						numTries--;
						document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
						
						if(x.innerHTML == t.innerHTML)
						{
							match.play();
							changeClassName(x,"p");
							changeClassName(t,"p");
							pairedCards.push(x);
							pairedCards.push(t);
							
							P--;
						}
					}
					else
					{
						changeClassName(x,"");
					}
				
				}
				else if(visibleCards.length  == 2)
				{
					if(x != t && y != t)
					{
						flipSound.play();
						changeClassName(t,"v");
						changeClassName(x,"");
						changeClassName(y,"");
						numTries--;
						document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
					}
					else
					{
						changeClassName(x,"");
						changeClassName(y,"");
					}
					
				}
				
				if(!P)
				{
					document.getElementById("flip-front").innerHTML = "<h1>YOU HAVE WON!</h1>";
					applause.play();
				}
					
				}
			
			
			
		
		}
		else
		{
			document.getElementById("flip-front").innerHTML = "<h1>YOU LOSE!!!!</h1>";
			boo.play();
			var reset = document.getElementById("button_holder");
			var button = '<button onclick="setup()" id="resetButton">START OVER!!!</button>';
			reset.innerHTML = button;
			
		}
	
}


function generateDeck()
{
    P=8;
    // Fill in p array that represents the pack of cards.
    q="A234567890JQK".split("");
    var img = ["spade.png", "heart.png", "club.png", "diamond.png"];



    for(var c = 0; c < 4; c++)
    {
        for(i = 0; i < 13; i++)
            cardPack.push( [img[c], q[i] ] );
    }
    // Pull out a card and put it on the deck twice. Those will be the pairs.

    for(i = 0; i < 8; i++)
    {
        deck[i] = deck[i+8] = R(cardPack);
    }
}

function displayDeck()
{

    // start to draw the screen

    var deckArea ='<div style="width:450px">';

    // we need to create 16 cards
    for(var i = 16; i ; i--)
    {
        // take out a random element from the cards on the deck
       var card = R(deck);
        deckArea +='<div class="w" onclick="Flip(this)"> <div class="cardfront"><img id="icon" src="static/'+card[0]+'"/><div id="cardNum">'
            +card[1]+'</div><img id="icon2" src="static/'+card[0]+'"/></div><div class="cardback"><img id="cardlogo" src="static/cardback.png" /></div></div>'
    }
    // add it to the DOM
	
    currentGame.innerHTML = deckArea +'</div>';

}