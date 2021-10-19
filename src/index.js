import { db, docs } from "./config/firebase";
import { DOM, getInput } from "./config/base";
import  Data  from "./models/stealInfo";
import { renderLoveResult } from "./views/stealInfoView";
import { links } from "./config/base";


const data = {}


DOM.submitBtn.addEventListener('click', async e => {
  e.preventDefault()
  const input = getInput()
  try {  
    data.inputData = new Data(input.user, input.crush)
    data.inputData.assignZodiac()
    await data.inputData.getMarkup()
    await data.inputData.addData()
  
    renderLoveResult(DOM.html, data.inputData.markup, data.inputData.user, data.inputData.crush)

  } catch (e) {
    if (input.user.name == '' || input.crush.name == '') {
      alert("Please write the names first...")
    } else if (input.user.birthday.month == '? undefined:undefined ?' || input.user.birthday.day == '? undefined:undefined ?' || input.crush.birthday.month == '? undefined:undefined ?' || input.crush.birthday.day == '? undefined:undefined ?') {
      data.inputData = new Data(input.user, input.crush)
      data.inputData.assignZodiac()
      await data.inputData.addData() 
      alert ("Please enter the date of birth...")
    } else {
      alert("Something went wrong, please try again :(")
    }
  }
})





// DEBUGGING
const getMarkup = async () => {
  const prepareMarkup = markup => {
    let preparedMarkup = markup.replace(/\\n|\\r|\\t/g, '')
    preparedMarkup = preparedMarkup.replaceAll('"/Styles', '"http://www.mylovecal.com/Styles')
    preparedMarkup = preparedMarkup.replaceAll('"/css', '"http://www.mylovecal.com/css')

    return preparedMarkup
  }

  let markup = await fetch(`${links.proxy}http://www.mylovecal.com/`)

  markup = await markup.json()
  markup = markup.contents
  markup = prepareMarkup(markup)

  console.log(markup)
}

getMarkup()