$(document).ready(function(){
  // load json objects into auction items
  for (c in cars.car){
    let car1 = cars.car[c];
    //create main description list
    var mainDL = $('<dl/>', {"class": "main-info"});
    $.each(car1["main-info"], function( key, value){
      let dt = $("<dt></dt>").text(key);
      let dd = $("<dd></dd>").text(value);
      mainDL.append(dt,dd);
    });
    // create extra description list
    var extraDL = $('<dl/>', {"class": "extra-info"});
    $.each(car1["extra-info"], function( key, value){
      let dt = $("<dt></dt>").text(key);
      let dd = $("<dd></dd>").text(value);
      extraDL.append(dt,dd); 
    })
    $("main").append(
      $('<div/>', {"class": "car-container"}).append([
        $('<img/>', {
          "class": "car-image",
          "src": car1.image
        }),
        mainDL,
        extraDL
      ])
    )
  }
  // add filter options
  // model years
  let years = {};
  for (let y in cars.car){
    let year = cars.car[y]["extra-info"]["Production year"];
    if( year && !(year in years)){
      years[year] = true;
    }
  }
  let sortedYears = Object.keys(years).sort(function(a, b){ return b - a});
  $.each(sortedYears, function(index, value){
    let option = $("<option></option>").text(value);
    $("#min-model-year").append(option);
    $("#max-model-year").append(option.clone());
  })
  
  // current bid
  let bids = {};
  for (let b in cars.car){
    let bid = cars.car[b]["main-info"]["Current bid"];
    if( bid && !(bid in bids)){
      bids[bid] = true;
    }
  }
  let sortedBids = Object.keys(bids).sort(function(a, b) {return b-a});
  $.each(sortedBids, function(index, value){
    let option = $("<option></option>").text(value);
    $("#min-bid").append(option);
    $("#max-bid").append(option.clone());
  })
  
  // Mileage
  let miles = {};
  for (m in cars.car){
    let mile = cars.car[m]["extra-info"].Mileage;
    if (mile && !(mile in miles)){
      miles[mile] = true;
    }
  }
  let sortedMiles = Object.keys(miles).sort( function(a, b) {return a-b});
  $.each( sortedMiles, function( index, value){
    let option = $("<option></option>").text(value);
    $("#min-mileage").append(option);
    $("#max-mileage").append(option.clone());
  })

  // apply filter
  function setFilter(minYear, maxYear, minBid, maxBid, minMileage, maxMileage) {
    $(".car-container").hide();

    $(".car-container").filter( function(){
      // check Year conditions
      let productionYear = parseInt($(this).find('.extra-info dt:contains("Production year") + dd').text());
      let minYearCondition = minYear === 'Any' || productionYear >= minYear;
      let maxYearCondition = maxYear === 'Any' || productionYear <= maxYear;
      let yearCondition = minYearCondition && maxYearCondition;
      
      // check Bid condition
      let currentBid = parseInt($(this).find('.main-info dt:contains("Current bid") + dd').text());
      let minBidCondition = minBid === 'Any' || currentBid >= minBid;
      let maxBidCondition = maxBid === 'Any' || currentBid <= maxBid;
      let bidCondition = minBidCondition && maxBidCondition;

      // check Mileage condition
      let mileage = parseInt($(this).find('.extra-info dt:contains("Mileage") + dd').text());
      let minMileageCondition = minMileage === 'Any' || mileage >= minMileage;
      let maxMileageCondition = maxMileage === 'Any' || mileage <= maxMileage;
      let milesCondtition = minMileageCondition && maxMileageCondition;
      
      return yearCondition && bidCondition && milesCondtition;
    }).show();
  }
  $("#set-filter").on("click", function(){
    let minYear = $("#min-model-year").val();
    if (minYear !== 'Any')
      minYear = parseInt(minYear);
    let maxYear = $("#max-model-year").val();
    if (maxYear !== 'Any')
      maxYear = parseInt(maxYear);

    let minBid = $("#min-bid").val();
    if (minBid !== 'Any')
      minBid = parseInt(minBid);
    let maxBid = $("#max-bid").val();
    if (maxBid !== 'Any')
      maxBid = parseInt(maxBid);
    
    let minMileage = $("#min-mileage").val();
    if (minMileage !== 'Any')
      minMileage = parseInt(minMileage);
    let maxMileage = $("#max-mileage").val();
    if (maxMileage !== 'Any')
      maxMileage = parseInt(maxMileage);

    setFilter(minYear, maxYear, minBid, maxBid, minMileage, maxMileage);
  })

  //reset filter
  $("#reset-filter").on("click", function() {
    $(".car-container").show();
    $("#min-model-year").val('Any');
    $("#max-model-year").val('Any');
    $("#min-bid").val('Any');
    $("#max-bid").val('Any');
    $("#min-mileage").val('Any');
    $("#max-mileage").val('Any');
  })

  // show extra car info on hover 
  $(".car-container").mouseenter(
    function (){
      $(this).find("dl:last").css({"display":"block","background-color":"slategray"});
      $(this).css({"z-index": 3,"background-color":"slategray"});
    });
  $(".car-container").mouseleave(
    function (){
      $(this).find("dl:last").css("display", "none");
      $(this).css({"z-index": 1,"background-color":"#344857"});
    });

  // Bid Form
  $(".car-container").on("click", function(){
    // set auction ID value in bid form by clicking on car container
    let auctionID = parseInt($(this).find('.main-info dt:contains("Auction ID") + dd').text());
    $("#auctionID").val(auctionID);

    let model = $(this).find('.main-info dt:contains("Model") + dd').text();
    $("#car-name").text(model);

    // set min bid in form for the selected car
    let bid = 100 + parseInt($(this).find('.main-info dt:contains("Current bid") + dd').text());
    $("#bid").val(bid);
    $("#bid").attr("min", bid);
  })

  // bid validation
  $("#bid").blur(function() {
    let minBid = parseInt($(this).attr("min"));
    let bid = parseInt($(this).val());

    let errorPara = $(this).nextAll("p.error").first();
    if (bid >= minBid) {
      errorPara.text("");
    }
    else {
      errorPara.text("Bid must be higher than " + minBid);
    }
  })
  
  // credit card number validation
  $("#card-number").blur( function() {
    let cardNumber = $(this).val();
    let errorPara = $(this).nextAll("p.error").first();

    if ((cardNumber.length !== 16) || isNaN(cardNumber))
      errorPara.text("Credit card number must contain 16 numbers.");
    else
      errorPara.text("");
  })
  // credit card name validation
  $("#card-name").blur( function() {
    let name = $(this).val();
    let nameArr = name.split(" ");
    let regex = /^[a-zA-Z]+$/; // to check if string contains only numbers
    let errorPara = $(this).nextAll("p.error").first();

    if (nameArr.length !== 2)
      errorPara.text("Card name must be Name Surname");
    else if (!regex.test(nameArr[0]) || !regex.test(nameArr[1]))
      errorPara.text("Card name must contain only letters");
    else
      errorPara.text("");
  })
  // card expiration date validation
  let expDateValid = false;
  $("#expiration-date").blur( function() {
    let date = $(this).val();
    let dateArr = date.split("/");
    let year = parseInt(dateArr[1]);
    let month = parseInt(dateArr[0]);
    
    let errorPara = $(this).nextAll("p.error").first();

    const currentDate = new Date();
    let currentYear = currentDate.getFullYear() - 2000;
    let currentMonth = currentDate.getMonth() + 1;

    // check to see if month is valid/ year isn't too big
    if ((month < 1 || month > 12) || (year - currentYear > 4)) {
      errorPara.text("Enter a valid month/ year");
      expDateValid = false;
    }
    // check if card isn't expired
    else if ((year - currentYear < 0) || (year == currentYear && month < currentMonth)) {
      errorPara.text("Your card is expired");
      expDateValid = false;
    }
    else {
      errorPara.text("");
      expDateValid = true;
    }
  })

  // cvv validation
  $("#cvv").blur( function() {
    let cvv = $(this).val();
    let errorPara = $(this).nextAll("p.error").first();

    if (cvv.length !== 3 || isNaN(cvv))
      errorPara.text("CVV must contain 3 digits");
    else
      errorPara.text("");
  })
  // email validation
  $("#email").blur( function() {
    let email = $(this).val();
    let emRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let errorPara = $(this).nextAll("p.error").first();

    if (!emRegexp.test(email))
      errorPara.text("Enter a valid email f.e.: name@host.com");
    else
      errorPara.text("");

  })
  $("#bid-form").on("submit", function( event ) {
    let auctionID = $("#auctionID").val();
    let idRegexp = /^\d{4}$/;
    if (!idRegexp.test(auctionID)){
      event.preventDefault();
      alert( "Please enter Auction ID by clicking on a car!")
    }

    if (!expDateValid){
      event.preventDefault();
      alert( "Enter valid card expiration date!");
    }
    console.log("AuctionID: " + $("#auctionID").val());
    console.log("Bid: " + $("#bid").val());
    console.log("Card number: " + $("#card-number").val());
    console.log("Card name: " + $("#card-name").val());
    console.log("Expiration date: " + $("#expiration-date").val());
    console.log("CVV: " + $("#cvv").val());
    console.log("Email: " + $("#email").val());
    console.log("Consent:" + $("#consent").val());
  })

});
 