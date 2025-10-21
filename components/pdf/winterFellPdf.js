
export const TemplateWinterfell = (data) => {
  const ClientName = data.ClientName || data["Client-Name"] || "Rahul";
  const Itinerary = data.Itinerary || [];
  const DetailedItinerary = data.Itinearies || [];
  const {
    DestinationName = "Bali",
    NoOfPax = 2,
    TravelDate = "2026-11-10",
    Days = 5,
    Nights = 4,
    Costs = { TotalCost: 40000 },
    Hotels = [
      { Name: "The Anathera Resort", RoomType: "Deluxe Room with Pool View", Meals: ["Breakfast"], CheckInDate: "10th Nov", CheckOutDate: "15th Nov", ImageUrl: "https://d30j33t1r58ioz.cloudfront.net/static/sample-hotel.jpg" },
      { Name: "Aeera Villa Canggu", RoomType: "One Bedroom Villa with Private Pool", Meals: ["Breakfast"], CheckInDate: "15th Nov", CheckOutDate: "18th Nov", ImageUrl: "https://d30j33t1r58ioz.cloudfront.net/static/sample-hotel2.jpg" }
    ],
    Inclusions = [],
    Exclusions = [],
  } = data;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "-";

  const bg = "https://d30j33t1r58ioz.cloudfront.net/static/mountain-bg-light.jpg";

  return `
  <html>
    <head>
      <style>
        @page { 
          size: A4; 
          margin: 0; 
          width: 210mm;
          height: 297mm;
        }
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          color: #111;
          background: #fff;
          font-size: 18px;
        }
        h1,h2,h3,h4 { margin: 0; padding: 0; }

        .page {
          page-break-after: always;
          padding: 0;
          width: 210mm;
          height: 297mm;
          position: relative;
          background-image: url('${bg}');
          background-size: cover;
          background-position: bottom;
          background-repeat: no-repeat;
          box-sizing: border-box;
        }

        .cover {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 297mm;
          text-align: center;
          padding: 60px;
        }

        .logo-box {
          background: #000;
          color: #fff;
          padding: 40px 70px;
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 4px;
          margin-bottom: 50px;
          text-align: center;
          line-height: 1.2;
        }

        .tagline {
          font-size: 28px;
          font-style: italic;
          color: #333;
          font-weight: 400;
          line-height: 1.4;
          margin-bottom: 50px;
        }

        .content-page {
          padding: 40px 30px;
          background: rgba(255, 255, 255, 0.95);
          margin: 20px;
          border-radius: 8px;
          min-height: calc(297mm - 80px);
        }

        .section-title {
          background: #000;
          color: #fff;
          text-align: center;
          font-size: 26px;
          font-weight: 600;
          padding: 20px;
          margin-bottom: 35px;
          letter-spacing: 1px;
        }

        .package-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 20px;
          margin-bottom: 50px;
        }
        
        .package-table th {
          background: #f5f5f5;
          padding: 20px 25px;
          border: 1px solid #ddd;
          font-weight: 600;
          text-align: left;
          width: 35%;
        }
        
        .package-table td {
          padding: 20px 25px;
          border: 1px solid #ddd;
          background: #fff;
        }

        .price-container {
          display: flex;
          justify-content: center;
          margin: 40px 0;
        }

        .price-box {
          position: relative;
          background: #333;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          padding: 25px 45px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .price-text {
          font-size: 36px;
          margin-bottom: 8px;
        }

        .price-label {
          font-size: 24px;
          font-weight: 600;
        }

        .price-decoration {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 50px;
          height: 50px;
          background: #4a90e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .price-decoration::before {
          content: "💰";
          font-size: 20px;
        }

        .itinerary-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          margin-bottom: 30px;
        }
        
        .itinerary-table th {
          background: #000;
          color: #fff;
          padding: 12px 15px;
          font-weight: 600;
          text-align: left;
        }
        
        .itinerary-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          background: #fff;
        }

        .detailed-day {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid #eee;
          page-break-inside: avoid;
          min-height: 200px;
        }


        .day-header {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
        }

        .day-icon {
          width: 80px;
          height: 80px;
          background: #4a90e2;
          border-radius: 50%;
          margin-right: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 32px;
          flex-shrink: 0;
        }

        .day-title {
          font-size: 22px;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
        }

        .day-content {
          font-size: 16px;
          line-height: 1.7;
          color: #555;
          margin-bottom: 25px;
        }

        .day-image {
          width: 100%;
          max-width: 400px;
          height: 250px;
          object-fit: cover;
          border-radius: 12px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .activity-item {
          margin: 8px 0;
          padding-left: 20px;
          position: relative;
        }

        .activity-item:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #4a90e2;
          font-weight: bold;
        }

        .separator {
          text-align: center;
          margin: 30px 0;
          font-size: 20px;
          color: #ccc;
        }

        .accommodation-card {
          display: flex;
          margin-bottom: 30px;
          background: #fff;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0,0,0,0.1);
          padding: 15px;
          align-items: flex-start;
        }

        .hotel-image {
          width: 180px;
          height: 140px;
          object-fit: cover;
          border-radius: 15px;
          margin-right: 25px;
          flex-shrink: 0;
        }

        .hotel-details {
          flex: 1;
          padding: 5px 0;
        }

        .hotel-details ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .hotel-details li {
          margin: 8px 0;
          font-size: 14px;
          position: relative;
          padding-left: 15px;
          line-height: 1.4;
        }

        .hotel-details li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #333;
          font-weight: bold;
        }

        .footer-logo {
          position: absolute;
          bottom: 20px;
          right: 30px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          font-size: 10px;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
        }

        .center { text-align: center; }
        
        p {
          font-size: 14px;
          line-height: 1.6;
          margin: 10px 0;
        }

        .scenic-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>

      <!-- Cover Page -->
      <div class="page cover">
        <div class="logo-box">WINTERFELL<br/>HOLIDAYS</div>
        <div class="tagline">Designed for Dreamers.<br/>Built for Travelers...</div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

      <!-- Package Details -->
      <div class="page">
        <div class="content-page">
          <div class="section-title">Package Details</div>
          <table class="package-table">
            <tr><th>Destination</th><td>${DestinationName}</td></tr>
            <tr><th>Name</th><td>${ClientName}</td></tr>
            <tr><th>No of Pax</th><td>${NoOfPax} Adults</td></tr>
            <tr><th>Date</th><td>${formatDate(TravelDate)}</td></tr>
            <tr><th>Duration</th><td>${Days} Days ${Nights} Nights</td></tr>
          </table>
          <div class="price-container">
            <div class="price-box">
              <div class="price-decoration"></div>
              <div class="price-text">INR ${Costs?.TotalCost?.toLocaleString("en-IN") || "40,000"}/-</div>
              <div class="price-label">Total</div>
            </div>
          </div>
        </div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

      <!-- Accommodation -->
      <div class="page">
        <div class="content-page">
          <div class="section-title">Accommodation</div>
          ${Hotels.map((h, index) => `
            <div class="accommodation-card">
              <img class="hotel-image" src="${h.ImageUrl || "https://d30j33t1r58ioz.cloudfront.net/static/sample-hotel.jpg"}" alt="Hotel Image"/>
              <div class="hotel-details">
                <ul>
                  <li>Hotel - ${h.Name || "The Anathera Resort"}</li>
                  <li>Room - ${h.RoomType || "Deluxe Room with Pool View"}</li>
                  <li>Meal - ${"Breakfast"}</li>
                  <li>No of Rooms - 1</li>
                  <li>No of Nights - ${index === 0 ? "5" : "2"}</li>
                  <li>Check IN - ${h.CheckInDate || "10th Nov"}</li>
                  <li>Check OUT - ${h.CheckOutDate || "15th Nov"}</li>
                </ul>
              </div>
            </div>
            ${index < Hotels.length - 1 ? '<div class="separator">✤</div>' : ''}
          `).join("")}
        </div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

      <!-- Detailed Itinerary -->
      ${(() => {
        const itemsPerPage = 2;
        const pages = [];
        for (let i = 0; i < DetailedItinerary.length; i += itemsPerPage) {
          const pageItems = DetailedItinerary.slice(i, i + itemsPerPage);
          pages.push(`
            <div class="page">
              <div class="content-page">
                ${i === 0 ? '<div class="section-title">Detailed Itinerary</div>' : ''}
                ${pageItems.map((day, pageIndex) => {
                  const globalIndex = i + pageIndex;
                  const getIcon = (index) => {
                    const icons = ['✈', '🏛', '🏰', '🏔', '🌊', '🎭', '🍷', '🎨', '🌅'];
                    return icons[index % icons.length] || '🗺';
                  };
                  return `
                    <div class="detailed-day">
                      <div class="day-header">
                        <div class="day-icon">${getIcon(globalIndex)}</div>
                        <div class="day-title">Day ${day.day || globalIndex + 1} - ${day.Title || "Day Activity"}</div>
                      </div>
                      ${day.ImageUrl ? `<img class="day-image" src="${day.ImageUrl}" alt="Day ${day.day || globalIndex + 1} Activity"/>` : ''}
                      <div class="day-content">
                        ${day.Description ? day.Description.replace(/<[^>]*>/g, '') : day.Activities || "No description available"}
                      </div>
                      ${pageIndex < pageItems.length - 1 ? '<div class="separator">✤</div>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
            </div>
          `);
        }
        return pages.join('');
      })()}

      <!-- Day Wise Itinerary -->
      <div class="page">
        <div class="content-page">
          <div class="section-title">Day Wise Itinerary</div>
          <table class="itinerary-table">
            <tr>
              <th style="width: 15%;">Date</th>
              <th style="width: 15%;">Day</th>
              <th style="width: 70%;">Title</th>
            </tr>
            <tr><td>10th Nov</td><td>Day 1</td><td>Bali Arrival</td></tr>
            <tr><td>11th Nov</td><td>Day 2</td><td>Water Sports + Uluwatu Temple + Kecak Fire Dance</td></tr>
            <tr><td>12th Nov</td><td>Day 3</td><td>Nusa Penida Tour + Lunch (Excluding $3 PP Island Fee)</td></tr>
            <tr><td>13th Nov</td><td>Day 4</td><td>Inter Transfer + Tanah Lot</td></tr>
            <tr><td>14th Nov</td><td>Day 5</td><td>Ubud Tour + Bali Aloha Swing Package</td></tr>
            <tr><td>15th Nov</td><td>Day 6</td><td>Departure</td></tr>
          </table>
          <img class="scenic-image" src="https://d30j33t1r58ioz.cloudfront.net/static/sample-beach.jpg" alt="Scenic View"/>
        </div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

    </body>
  </html>
`;
};
