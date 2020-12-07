const { Card, CardContent, Typography } = require("@material-ui/core");
var numeral = require('numeral');

function InfoBox({title,today,total,type,onClick}) {
        return (
        <div className={`infoBox${type===title ? ' infoBox--selected': ''}`}>
            <Card className="cardContainer" onClick={onClick}>
                <CardContent>
                    <Typography variant="h6" component="h4">
                    {title}
                    </Typography>
                    <Typography component="p" variant="body2" className="todayCases">
                        {numeral(today).format("+0,0")}
                    </Typography>
                    <Typography component="p" variant="body2">
                        {numeral(total).format("+0,0") + " Total"}
                    </Typography>
                </CardContent>
            </Card>
        </div>);
}
export default InfoBox;