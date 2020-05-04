const { google } = require('googleapis');
const sheets = google.sheets({
    version: 'v4',
    auth: 'AIzaSyCe_o_dpoVGp2LD5JCTBTymNfl8F09b2iw',
});

const mapOsuBId = (text) => {
    const match = text && `${text}`.match(/^=HYPERLINK\(.*https:\/\/osu.ppy.sh\/b\/([0-9]*).*\).*$/);

    return match && match[1];
}

sheets.spreadsheets.values.get({
    spreadsheetId: '1rNNEonpr0_XlmcjEC3WF1InPOp6V2HcCGpELDxB1lvc',
    valueRenderOption: 'FORMULA',
    range: 'QF Mappool',
}, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    
    if (rows.length) {
        const bIds = rows.map((row) => {
            return row.map(mapOsuBId).filter((value) => (value));
        });

        const b2 = bIds.reduce((a, b) => a.concat(b), []);

        console.log('?', b2);
    } else {
      console.log('No data found.');
    }
});



