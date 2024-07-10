let sayings = []
let seenSayings = new Set()
let correctSayings = new Set()
let currSayingIndex = -1
let currSayingFirstPart = ""
let currSayingSecondPart = ""

//Fetch sayings from text file
async function fetchSayings()
{
  try
  {
    const response = await fetch("./resources/Refranes.txt")
    if(response.ok)
    {
      const text = await response.text()
      sayings = text.split("\n").filter(saying => saying.trim() !== "")
      DisplayRandomSaying()
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

  if (seenSayings.size === sayings.length)
  {
    seenSayings.clear();
  }

  let newSayingIndex;
  do
  {
    newSayingIndex = Math.floor(Math.random() * sayings.length)
    
  } while(seenSayings.has(newSayingIndex) ||                                   correctSayings.has(newSayingIndex))
  
  seenSayings.add(newSayingIndex)
  currSayingIndex = newSayingIndex

  let [firstPart, secondPart] = splitSaying(sayings[currSayingIndex])
  currSayingFirstPart = firstPart
  currSayingSecondPart = secondPart
  
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

  console.log("User Answer:", normalizedUserAnswer, "Length:", normalizedUserAnswer.length);
  console.log("Correct Answer:", normalizedCorrectAnswer, "Length:", normalizedCorrectAnswer.length);

  if (normalizedCorrectAnswer === normalizedUserAnswer)
  {
    document.getElementById("message").textContent = "Correct!"
    correctSayings.add(currSayingIndex)
    nextSaying()
  }
  else
  {
    document.getElementById("message").textContent = `Incorrect, the correct answer is : '${currSayingSecondPart}'`
  }
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
  seenSayings.clear()
  correctSayings.clear()
  document.getElementById("txtUserAnswer").value = ""
  document.getElementById("message").textContent = ""

  DisplayRandomSaying()
}

//Event listener for buttons
document.getElementById("btnNext").addEventListener("click", nextSaying)
document.getElementById("btnAnswer").addEventListener("click", checkAnswer)
document.getElementById("btnRestart").addEventListener("click", resetGame)

fetchSayings()
