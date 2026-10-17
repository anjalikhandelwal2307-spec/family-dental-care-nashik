// Appointment page: step 1 (new / existing) then the booking form
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var stepChoose = $("#stepChoose"), stepForm = $("#stepForm");
  var form = $("#apptForm"), treatment = $("#treatment"), msg = $("#msg");
  var patient = "", msgEdited = false;

  var TREATMENTS = ["Wisdom Teeth Removal", "Tooth Extractions", "Canine Exposure", "Oral Biopsy", "IV Sedation",
    "General Anesthesia", "Bone Grafting", "Ridge Augmentation", "Sinus Lifts", "Dental Implants",
    "Implant Supported Dentures", "Single Tooth Implant", "Botox for TMD", "Others"];
  TREATMENTS.forEach(function (t) { treatment.add(new Option(t, t)); });

  // treatment chosen on the services page
  var wanted = new URLSearchParams(location.search).get("treatment");
  if (wanted && TREATMENTS.indexOf(wanted) > -1) treatment.value = wanted;

  function prefill() {
    var who = patient === "existing"
      ? "I am an existing patient of Family Dental Care"
      : "I am a new patient";
    var t = treatment.value;
    var what = !t ? "a dental check-up and consultation"
      : t === "Others" ? "a consultation about my dental concern"
      : t;
    return "Hello, " + who + " and I would like to book an appointment for " + what +
      ". Please call me to confirm a suitable time.";
  }
  function refreshMsg() { if (!msgEdited) msg.value = prefill(); }

  function show(type) {
    patient = type;
    $("#whoLabel").textContent = type === "existing" ? "Existing patient" : "New patient";
    stepChoose.hidden = true;
    stepForm.hidden = false;
    msgEdited = false;
    refreshMsg();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(function () { $("#name").focus({ preventScroll: true }); }, 300);
  }
  document.querySelectorAll(".choice").forEach(function (b) {
    b.addEventListener("click", function () { show(b.dataset.type); });
  });
  $("#changeWho").addEventListener("click", function () {
    stepForm.hidden = true;
    stepChoose.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  treatment.addEventListener("change", refreshMsg);
  msg.addEventListener("input", function () { msgEdited = true; });

  // date: no past days, no Sundays (clinic closed)
  var date = $("#date");
  date.min = new Date().toISOString().split("T")[0];
  date.addEventListener("change", function () {
    var bad = date.value && new Date(date.value + "T00:00").getDay() === 0;
    $("#dateErr").style.display = bad ? "block" : "none";
    date.setCustomValidity(bad ? "Closed on Sundays" : "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!/^\d{10}$/.test($("#phone").value.replace(/\s/g, ""))) {
      $("#phoneErr").style.display = "block";
      return;
    }
    $("#phoneErr").style.display = "none";
    var name = $("#name").value.replace(/[<>&]/g, "");
    form.innerHTML = '<div class="done"><div class="tick">&#10003;</div><h3>Request received</h3><p>Thank you, ' + name +
      '. Our front desk will call you shortly to confirm your appointment.</p></div>';
  });
})();
