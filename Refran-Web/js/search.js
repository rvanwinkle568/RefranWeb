let sayings = []

//Fecth sayings
async function fetchSayings()
{
  try
  {
    const response = await fetch("../resources/Refranes.txt")
    if(response.ok)
    {
      const text = await response.text()
      sayings = text.split("\n").filter(saying => saying.trim() !== "")

      displayResults(sayings)
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

//Function to remove accents and punctioation
function grammarMemes(text)
{
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                              .toLowerCase()
}

//Search sayings
function searchSayings()
{
  const searchTerm = grammarMemes(document.getElementById("searchBar").value.trim())
  const results = sayings.filter(saying => grammarMemes(saying.toLowerCase()).includes(searchTerm))

  displayResults(results)
}

//Display results
function displayResults(results)
{
  const resultDiv = document.getElementById("results")
  resultDiv.innerHTML = ""

  results.forEach(saying => 
    {
      const resultItem = document.createElement("div")
      resultItem.className = "result-item"
      resultItem.textContent = saying
      resultDiv.appendChild(resultItem)
    }
  )
}

//Event listener for search button
document.getElementById("searchBar").addEventListener("input", searchSayings)

//Fetch the sayings
fetchSayings()