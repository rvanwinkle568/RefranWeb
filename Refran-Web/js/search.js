let sayings = []

//Database tisms
const SUPABASE_URL = 'https://phcinudykoqedghbcvsj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ludWR5a29xZWRnaGJjdnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMDU5MjQsImV4cCI6MjA2MTg4MTkyNH0.NmXLOoFiLvxcgoLBVoHKFgpUFQsufppmwKnaJAKluws';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//Fecth sayings
async function fetchSayings()
{
  try
  {
    const { data, error } = await supabase
    .from('Sayings')
    .select('full_saying')
    
    if(error)
    {
      console.error("Failed to fetch the sayings from Supabase: ", error.message)
      return;
    }

    sayings = data.map(row => row.full_saying)
    displayResults(sayings)
  }
  catch (error)
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