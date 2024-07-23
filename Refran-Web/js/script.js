let sayings = []
let fetchedSayings = []
let correctSayings = new Set()
let currSayingIndex = -1
let currSayingFirstPart = ""
let currSayingSecondPart = ""

//Fetch sayings from text file
async function fetchSayings()
{
  try
  {
    const response = await fetch("../resources/Refranes.txt")
    if(response.ok)
    {
      const text = await response.text()
      fetchedSayings = text.split("\n").filter(saying => saying.trim() !== "")

      //Load game
      loadGame(fetchedSayings)
      
      //Display current saying if it exist, otherwise display a new saying
      if (currSayingIndex === -1)
      {
        DisplayRandomSaying()
      }
      else
      {
        displayCurrentSaying()
      }

      //Update remaining sayings
      updateCounts()
    }
    else
    {
      console.error("Failed to fetch sayings", response.statusText)
    }
  }
  catch
  {
    console.error("Error fetching sayings", error)    
  }
}

//Function to split the saying
function splitSaying(saying)
{
  let words = saying.split(" ")
  let minWords = Math.max(3, Math.floor(words.length/ 2))
  let firtsPart = words.slice(0, minWords).join(" ")
  let secondPart = words.slice(minWords).join(" ")

  return [firtsPart + "...", secondPart]
}

//Function to display random sayings
function DisplayRandomSaying()
{
  if (sayings.length === 0)
  {
    document.getElementById("lblSaying").textContent = "No sayings available"
    return
  }

  let newSayingIndex = Math.floor(Math.random() * sayings.length)
    
  
  currSayingIndex = newSayingIndex

  let [firstPart, secondPart] = splitSaying(sayings[currSayingIndex])
  currSayingFirstPart = firstPart
  currSayingSecondPart = secondPart
  
  document.getElementById("lblSaying").textContent = currSayingFirstPart

  //Save game state
  saveGame()
}

function displayCurrentSaying()
{
  document.getElementById("lblSaying").textContent = currSayingFirstPart
}

//Function to remove accents and punctioation
function grammarMemes(text)
{
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                              .toLowerCase()
}

//Function to check user's answer
function checkAnswer()
{
  let userAnswer = document.getElementById("txtUserAnswer").value.trim()
  let normalizedUserAnswer = grammarMemes(userAnswer)
  let normalizedCorrectAnswer = grammarMemes(currSayingSecondPart.trim())

  if (normalizedCorrectAnswer === normalizedUserAnswer)
  {
    document.getElementById("message").textContent = "Correct!"
    sayings.splice(currSayingIndex, 1)
    correctSayings.add(currSayingIndex)
    
    nextSaying()
  }
  else
  {
    document.getElementById("message").textContent = `Incorrect, the correct answer is : '${currSayingSecondPart}'`
  }

  //Update Scores
  updateCounts()
  
  //Save game state
  saveGame()
}

//Function to display the next saying
function nextSaying()
{
  DisplayRandomSaying()
  document.getElementById("txtUserAnswer").value = "";                       document.getElementById("message").textContent = "";                   
}

//Function for reseting game
function resetGame()
{
  correctSayings.clear()
  sayings = fetchedSayings
  document.getElementById("txtUserAnswer").value = ""
  document.getElementById("message").textContent = ""

  DisplayRandomSaying()

  //Reset count
  updateCounts()
}

function updateCounts()
{
  document.getElementById("correctCount").textContent = correctSayings.size
  document.getElementById("remainingCount").textContent = sayings.length
}

function saveGame()
{
  const gameState = 
  {
    sayings: sayings,
    correctSayings: Array.from(correctSayings),
    currSayingIndex: currSayingIndex,
    currSayingFirstPart: currSayingFirstPart,
    currSayingSecondPart: currSayingSecondPart
  }
  localStorage.setItem("gameState", JSON.stringify(gameState))
}

function loadGame()
{
  const gameState = JSON.parse(localStorage.getItem("gameState"))

  if (gameState)
  {
    sayings = gameState.sayings.length ? gameState.sayings : fetchedSayings;
    correctSayings = new Set(gameState.correctSayings)
    currSayingIndex = gameState.currSayingIndex
    currSayingFirstPart = gameState.currSayingFirstPart
    currSayingSecondPart = gameState.currSayingSecondPart
  }
  else
  {
    sayings = fetchedSayings
  }
}

//Event listener for buttons
document.getElementById("btnNext").addEventListener("click", nextSaying)
document.getElementById("btnAnswer").addEventListener("click", checkAnswer)
document.getElementById("btnRestart").addEventListener("click", resetGame)

//Event listener for enter key press
document.getElementById("txtUserAnswer").addEventListener("keypress", function(event){
  if (event.key = "Enter"){
    checkAnswer()
  }
})

fetchSayings()
