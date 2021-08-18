

window.onload = () => {

  let lightArray = [], eventArray = []
  const numberOfLights = document.querySelector(".number-of-lights")
  const numberOfSevere = document.querySelector(".number-of-severe")
  const lightsList = document.querySelector(".lights-list")
  const severityAlerts = document.querySelector('.severity-alerts')
  let one = 0, two = 0, three = 0;
  stringOfErrors = ''
  errorCount = 0

  const callLightsApi = () => {
    fetch('https://ironbark-task.glitch.me/api/lights.json')
      .then(response => response.json())
      .then((data) => {
        splitLightDetails(data)
        combineData(lightArray[0], eventArray[0])
      });
  };

  const splitLightDetails = (data) => {
    lightArray.push(data)
  }

  const callEventsApi = () => {
    fetch('https://ironbark-task.glitch.me/api/events.json')
      .then(response => response.json())
      .then((data) => {
        splitEventDetails(data)
        countEventSeverity(data)
      });
  };

  const splitEventDetails = (data) => {
    eventArray.push(data)
  }

  const countEventSeverity = (data) => {
    one += (data.filter((event) => event.severity == "1").length)
    two += (data.filter((event) => event.severity == "2").length)
    three += (data.filter((event) => event.severity == "3").length)
    severityAlerts.innerText =
      `${one} Events at severity stage one \n
  ${two} Events at severity stage two \n
  ${three} Events at severity stage three`
  }


  const combineData = (lightsData, eventsData) => {
    lightsData.forEach((light) => {
      eventsData.forEach((event) => {
        if (light.light_id === event.light_id) {
          light["error"] = eventsData.filter((event) => light.light_id === event.light_id)
        }
      })
    })
    displayCombinedData(lightsData);
  }

  const displayCombinedData = (combinedApiData) => {
    numberOfLights.innerText = combinedApiData.length;
    numberOfSevere.innerText = `${combinedApiData.filter((light) => light.error).length} Lights with Severe Events on the grid`;
    displayLightData(combinedApiData)
  }

  const displayLightData = (lightsData) => {
    lightsData.forEach((light) => {
      displayErrorDetails(light)
      lightsList.insertAdjacentHTML("beforeend", `<h4>Light Id: ${light.light_id}, Color: ${light.color}, Wattage: ${light.wattage}, Lamp Type: ${light.lamp_type}, Severity Event Amount: ${errorCount} ${stringOfErrors} </h4>`)
      stringOfErrors = ''
      errorCount = 0
    })
  }

  const displayErrorDetails = (light) => {
    if ('error' in light) {
      errorCount = light['error'].length
      light['error'].splice(0, 3).forEach((error) => {
        const errorDetail = `<h5 class = ${colorChecker(error)}>Error: Id: ${error.event_id}, Code: ${error.code}, Severity: ${error.severity}, Description: ${error.description}, Duration (in seconds): ${error.duration_sec}</h5>`
        stringOfErrors += errorDetail
      })
    } else {
      `${errorCount}`
    }
  }

  const colorChecker = (error) => {
    if (error.severity == "1") { return "green" }
    if (error.severity == "2") { return "orange" }
    if (error.severity == "3") { return "red" }
  }
  // window.addEventListener('DOMContentLoaded', () => {
    callEventsApi()
    callLightsApi()
  // })
}
