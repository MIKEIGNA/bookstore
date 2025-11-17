# Apigee Proxy Bundle

This folder contains an Apigee proxy with Verify API Key policy.

Structure:
- apigee/proxies/bookstore/apiproxy/BookstoreAPI.xml
- apigee/proxies/bookstore/apiproxy/proxies/default.xml
- apigee/proxies/bookstore/apiproxy/targets/default.xml
- apigee/proxies/bookstore/apiproxy/policies/Verify-API-Key.xml

Import steps (Apigee X UI):
1. Zip the `apiproxy` folder:
   - On macOS/Linux: `cd apigee/proxies/bookstore && zip -r bookstore-api.zip apiproxy`
   - On Windows PowerShell: `Compress-Archive -Path apigee/proxies/bookstore/apiproxy -DestinationPath apigee/proxies/bookstore/bookstore-api.zip`
2. In Apigee, create a new Proxy > Reverse proxy > Upload the zip.
3. Set Base path: `/bookstore/api`.
4. Edit TargetEndpoint URL to your ECS task public IP: `http://PUBLIC_IP:4000` and deploy to your environment.
5. Add Product, create two Developers/Apps to obtain keys, and use header `x-api-key: <key>`.
6. Optional: create a TargetServer and reference it instead of a raw URL.