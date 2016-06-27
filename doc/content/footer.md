---
# Appendices

### Appendix A: Error Codes

<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Message</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1000</td>
            <td>Missing Consignee Address</td>
            <td>The consignee address is missing</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Invalid Consignee Address</td>
            <td>The consignee address either not a string or is above max chars</td>
        </tr>
        <tr>
            <td>2000</td>
            <td>Missing Consignee Name</td>
            <td>The consignee name is missing</td>
        </tr>
        <tr>
            <td>2001</td>
            <td>Invalid Consignee Name</td>
            <td>The consignee name either not a string or is above max chars</td>
        </tr>
        <tr>
            <td>3000</td>
            <td>Missing Consignee Contact Number</td>
            <td>The consignee contact number is missing</td>
        </tr>
        <tr>
            <td>3001</td>
            <td>Invalid Consignee Contact Number</td>
            <td>The consignee contact number either not a string or is above max chars</td>
        </tr>
        <tr>
            <td>4000</td>
            <td>Missing Is COD</td>
            <td>The Is COD flag is missing</td>
        </tr>
        <tr>
            <td>4001</td>
            <td>Invalid Is COD</td>
            <td>The Is COD flag either not a valid boolean</td>
        </tr>
        <tr>
            <td>4010</td>
            <td>Missing Amount to Collect</td>
            <td>The Amount to Collect is missing</td>
        </tr>
        <tr>
            <td>4011</td>
            <td>Invalid Amount to Collect</td>
            <td>The Amount to Collect either not a number or is beyond the allowed range</td>
        </tr>
        <tr>
            <td>5001</td>
            <td>Invalid Reference Number</td>
            <td>The reference number is either not a string or is above max chars</td>
        </tr>
        <tr>
            <td>6000</td>
            <td>Missing Declared Value</td>
            <td>The declared value is missing</td>
        </tr>
        <tr>
            <td>6001</td>
            <td>Invalid Declared Value</td>
            <td>The declared value not a number or or is beyond the allowed range</td>
        </tr>
        <tr>
            <td>7000</td>
            <td>Missing Package Description</td>
            <td>The package description is missing</td>
        </tr>
        <tr>
            <td>7001</td>
            <td>Invalid Package Description</td>
            <td>The package description either not a string or is above max chars</td>
        </tr>
        <tr>
            <td>8000</td>
            <td>Invalid Shipper Address</td>
            <td>Default Shipper Address has not yet been set in Client API Settings</td>
        </tr>
    </tbody>
</table>

### Appendix B: Status List

<table>
    <thead>
        <tr>
            <th>Value</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>15</td>
            <td>For Verification</td>
        </tr>
        <tr>
            <td>20</td>
            <td>Ready for Pickup</td>
        </tr>
        <tr>
            <td>30</td>
            <td>Acknowledged for pickup</td>
        </tr>
        <tr>
            <td>40</td>
            <td>Received by Rider, For Transferring</td>
        </tr>
        <tr>
            <td>60</td>
            <td>Received by Branch</td>
        </tr>
        <tr>
            <td>70</td>
            <td>Segregated by Area</td>
        </tr>
        <tr>
            <td>80</td>
            <td>Received by Rider, For Delivery</td>
        </tr>
        <tr>
            <td>90</td>
            <td>Received by Recipient</td>
        </tr>
        <tr>
            <td>100</td>
            <td>Recipient Not Found</td>
        </tr>
        <tr>
            <td>112</td>
            <td>Damaged Upon Delivery</td>
        </tr>
        <tr>
            <td>113</td>
            <td>Recipient is Unable To Pay</td>
        </tr>
        <tr>
            <td>114</td>
            <td>Delivery Rejected By Recipient</td>
        </tr>
        <tr>
            <td>120</td>
            <td>Cancelled</td>
        </tr>
        <tr>
            <td>160</td>
            <td>Other problems</td>
        </tr>
        <tr>
            <td>180</td>
            <td>Return to Shipper</td>
        </tr>
    </tbody>
</table>
