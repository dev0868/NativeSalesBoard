// pdf/TemplateWinterfell.js
export const TemplateWinterfell = (data) => {
  // Handle both field name variations
  const ClientName = data.ClientName || data["Client-Name"] || "";
  const Itinerary = data.Itinerary || data.Itineraries || [];
  
  const {
    DestinationName,
    NoOfPax,
    TravelDate,
    Days,
    Nights,
    Costs,
    Hotels = [],
    Inclusions = [],
    Exclusions = [],
  } = data;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return `
  <html>
    <head>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          background: #fdfdfd;
          color: #222;
        }
        h1,h2,h3,h4 { margin: 0; }
        .page {
          page-break-after: always;
          padding: 32px;
          background: #fff;
          background-image: url('https://d30j33t1r58ioz.cloudfront.net/static/pdf_bg.png');
          background-size: cover;
          background-position: bottom;
        }
        .section-title {
          background: #111;
          color: #fff;
          text-align: center;
          padding: 8px;
          font-size: 20px;
          letter-spacing: 0.5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #111;
          padding: 8px;
          text-align: left;
          font-size: 14px;
        }
        .center {
          text-align: center;
        }
        .amount-box {
          background: #000;
          color: #fff;
          padding: 20px;
          text-align: center;
          font-size: 24px;
          border-radius: 6px;
          margin: 40px 0;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          margin-top: 40px;
          opacity: 0.8;
        }
        img.hotel {
          width: 100%;
          border-radius: 12px;
          margin-bottom: 12px;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="section-title">Package Details</div>
        <table>
          <tr><th>Destination</th><td>${DestinationName}</td></tr>
          <tr><th>Name</th><td>${ClientName}</td></tr>
          <tr><th>No of Pax</th><td>${NoOfPax} Adults</td></tr>
          <tr><th>Date</th><td>${formatDate(TravelDate)}</td></tr>
          <tr><th>Duration</th><td>${Days} Days ${Nights} Nights</td></tr>
        </table>
        <div class="amount-box">INR ${Costs?.TotalCost?.toLocaleString("en-IN")} /- Total</div>
      </div>

      <div class="page">
        <div class="section-title">Day Wise Itinerary</div>
        <table>
          <tr><th>Date</th><th>Day</th><th>Title</th></tr>
          ${Itinerary.map(
            (day, i) => `
            <tr>
              <td>${formatDate(day.Date)}</td>
              <td>Day ${i + 1}</td>
              <td>${day.Title || "N/A"}</td>
            </tr>`
          ).join("")}
        </table>
      </div>

      <div class="page">
        <div class="section-title">Accommodation</div>
        ${Hotels.map(
          (h) => `
          <div style="margin-bottom:24px;">
            <img class="hotel" src="${h.ImageUrl || "https://via.placeholder.com/600x300"}" />
            <p><strong>Hotel:</strong> ${h.Name || "-"}<br/>
            <strong>Room:</strong> ${h.RoomType || "-"}<br/>
            <strong>Meal:</strong> ${"-"}<br/>
            <strong>Check-In:</strong> ${h.CheckInDate || "-"}<br/>
            <strong>Check-Out:</strong> ${h.CheckOutDate || "-"}</p>
          </div>`
        ).join("")}
      </div>

      <div class="page">
        <div class="section-title">Inclusions</div>
        <ul>
          ${Inclusions.map((inc) => `<li>${inc}</li>`).join("")}
        </ul>
        <div class="section-title">Exclusions</div>
        <ul>
          ${Exclusions.map((exc) => `<li>${exc}</li>`).join("")}
        </ul>
      </div>

      <div class="page">
        <div class="section-title">Payment Terms</div>
        <div class="center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/8b/QR_code_example.svg" width="150" />
          <p>GPay • PhonePe • Paytm</p>
          <table>
            <tr><th>Account Name</th><td>Winterfell Holidays</td></tr>
            <tr><th>Account Number</th><td>1100902123440000</td></tr>
            <tr><th>Type</th><td>Current Account</td></tr>
            <tr><th>Bank</th><td>HDFC Saket</td></tr>
            <tr><th>IFSC</th><td>HDFC0000043</td></tr>
          </table>
        </div>
      </div>

      <div class="page">
        <div class="section-title">About Us</div>
        <div style="text-align:center;">
          <p><strong>YOUR EXTRAORDINARY VACATION BEGINS HERE!</strong></p>
          <p>No matter where you want to go, we help get you there. Our experienced agents take time to listen and plan the best vacation.</p>
          <p>📍 H, 213, D Block, Sector 63, Noida, Uttar Pradesh 201309</p>
        </div>
      </div>

      <div class="footer">© Winterfell Holidays</div>
    </body>
  </html>
`;
};
