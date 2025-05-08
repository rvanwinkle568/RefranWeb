let sayings = []
let fetchedSayings = []
let correctSayings = new Set()
let currSayingIndex = -1
let currSayingFirstPart = ""
let currSayingSecondPart = ""

//Database tisms
const SUPABASE_URL = 'https://phcinudykoqedghbcvsj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ludWR5a29xZWRnaGJjdnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMDU5MjQsImV4cCI6MjA2MTg4MTkyNH0.NmXLOoFiLvxcgoLBVoHKFgpUFQsufppmwKnaJAKluws';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//Fetch sayings from text file
async function fetchSayings()
{
  try
  {
    const {data, error} = await supabase
      .from('Sayings')
      .select('full_saying')
      
    if (error) 
    {
      console.error("Failed to fetch sayings from Supbase: ", error.message);
      return;
    }

    //Mapping strings to array
    fetchedSayings = data.map(row => row.full_saying);

    //Load game
    loadGame()

    if (currSayingIndex === -1)
    {
      DisplayRandomSaying();
    }
    else{
      displayCurrentSaying();
    }

    updateCounts();
  }
  catch (error)
  {
    console.error("Unexpected error fetching sayings: ", error)
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
  sayings = [...fetchedSayings]
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
