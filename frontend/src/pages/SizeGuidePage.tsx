const SIZE_TABLE = [
  { us: '7', uk: '6', eu: '40', cm: '25' },
  { us: '8', uk: '7', eu: '41', cm: '26' },
  { us: '9', uk: '8', eu: '42.5', cm: '27' },
  { us: '10', uk: '9', eu: '44', cm: '28' },
  { us: '11', uk: '10', eu: '45', cm: '29' },
  { us: '12', uk: '11', eu: '46', cm: '30' },
]

export default function SizeGuidePage() {
  return (
    <>
      <div className="page-hero">
        <h1>Size Guide</h1>
        <p>Find your fit across US, UK, and EU sizing. Use our Smart Size Advisor on any product page.</p>
      </div>

      <section className="section content-page">
        <h2>How to measure</h2>
        <ol className="content-list">
          <li>Stand on a flat surface with your heel against a wall.</li>
          <li>Mark the tip of your longest toe and measure heel-to-toe in cm.</li>
          <li>Compare your measurement to the chart below.</li>
          <li>Between sizes? Size up for running; size down for snug lifestyle fits.</li>
        </ol>

        <div className="size-table-wrap">
          <table className="size-table">
            <thead>
              <tr>
                <th>US Men</th>
                <th>UK</th>
                <th>EU</th>
                <th>Foot length (cm)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_TABLE.map((row) => (
                <tr key={row.us}>
                  <td>{row.us}</td>
                  <td>{row.uk}</td>
                  <td>{row.eu}</td>
                  <td>{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Fit tips by category</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>Running</h3>
            <p>Thumb-width space at the toe. Snug midfoot, secure heel.</p>
          </div>
          <div className="info-card">
            <h3>Jordan / Lifestyle</h3>
            <p>True to size for most. Wide feet may prefer half size up.</p>
          </div>
          <div className="info-card">
            <h3>Kids</h3>
            <p>Growing room of about half a size for school-year wear.</p>
          </div>
        </div>
      </section>
    </>
  )
}
