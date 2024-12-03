# School Management

## Here are the methods and url for the application

## POST

### Add School

https://school-management-549e.onrender.com/api/schools/addSchool
This is the POST request for adding the school, where the endpoint is api/schools/addSchool

which expects a body with this example format shown below:

Body
raw (json)
json
{
"name":"AVM",
"address":"Chas, Bokaro",
"latitude":" 23.603252779136593",
"longitude": 86.0103135669449
}

## GET

### List Schools

https://school-management-549e.onrender.com/api/schools/listSchools?latitude=23.57440095555294&longitude=86.131817874322
This is the GET method for listing all the schools available on database and it will get sorted according to whichever is nearest to the location provided in query, thus it expects two queries, latitude and longitude where the user's current location latitude and longitude should be filled up.

Query Params
latitude
23.57440095555294
longitude
86.131817874322
