import express = require("express");
import DateController from "./Controllers/DateController";
import ProjectController from "./Controllers/ProjectController";
import UserController from "./Controllers/UserController";
import Middleware from "./middleware";
import ServiceController from "./Controllers/ServiceController";

const routes = express.Router();

routes.get("/", (req, res) => {
    res.status(200).send("Hello My friend!");
});

// User routes

/**
 * @openapi
 * /user/register: 
 *   post: 
 *     tags: 
 *       - User
 *     summary: Create a new user
 *     description: This endpoint will create a new user
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to be registered
 *                 example: jhondoe@email.com
 *               password:
 *                 type: string
 *                 description: Account access credentials
 *                 example: "**********"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                   description: Status of the request
 *                 msg:
 *                     type: string
 *                     example: Verification email sent! User created successfully!
 *                     description: Message of the request
 *       422:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email: 
 *                   type: string
 *                   example: Email is required
 *                   description: Email is required
 *                 password:
 *                   type: string
 *                   example: Password is required
 *                   description: Password is required
 *       500:
 *         description: User creation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                   description: Status of the request
 *                 msg:
 *                   type: string
 *                   example: error
 *                   description: Error message
 */
routes.post("/user/register", UserController.create);
/**
 * @openapi
 * /user/login:
 *   post:
 *    tags:
 *     - User
 *    summary: Perform user login 
 *    description: This endpoint will return a user after login succefully
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          description: Email to be registered
 *          example: jhondoe@email.com
 *         password:
 *          type: string
 *          description: Account access credentials
 *          example: "**********"
 *    responses:
 *     200:
 *      description: User logged in successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          user:
 *           type: object
 *           properties:
 *            uid: 
 *             type: string  
 *             example: DSf3...
 *             description: User ID         
 *            email:
 *             type: string
 *             example: jhondoe@email.com
 *             description: User email
 *            emailVerified: 
 *             type: boolean
 *             example: true
 *             description: Email verification status
 *            isAnonymous: 
 *             type: boolean
 *             example: false
 *             description: User is anonymous
 *            providerData:
 *             type: array
 *             items:
 *              type: object
 *              properties:
 *               providerId:
 *                type: string
 *                example: password
 *                description: Provider ID
 *               uid:
 *                type: string
 *                example: jondoe@email.com
 *                description: User UID
 *               displayName:
 *                type: string
 *                example: Jhon Doe
 *                description: User name
 *               email:
 *                type: string
 *                example: jhondoe@email.com
 *                description: User email
 *               photoURL:
 *                type: string
 *                example: null
 *                description: User photo URL
 *               phoneNumber:
 *                type: string
 *                example: null
 *                description: User phone number
 *            stsTokenManager:
 *             type: object
 *             properties:
 *              refreshToken:
 *               type: string
 *               example: AEu...
 *               description: Refresh token
 *              accessToken:
 *               type: string
 *               example: AEu...
 *               description: Access token
 *              expirationTime:
 *               type: number
 *               example: 1640000000000
 *               description: Token expiration time
 *            createdAt:
 *             type: string
 *             example: 1640000000000
 *             description: User creation time
 *            lastLoginAt:
 *             type: string
 *             example: 1640000000000
 *             description: User last login time
 *            apiKey:
 *             type: string
 *             example: AIza...
 *             description: User API key
 *            appName:
 *             type: string
 *             example: "[DEFAULT]"
 *             description: Application name
 *     500:
 *      description: User login failed
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: Failed
 *           description: Status of the request
 *          msg:
 *           type: string
 *           example: error
 *           description: Error message
 */
routes.post("/user/login", UserController.signin);
/**
 * @openapi
 * /user/logout:
 *   post:
 *    tags:
 *     - User
 *    summary: Log out the user
 *    description: Clear all API service access credentials
 *    responses:
 *     200:
 *      description: User logged out successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          msg:
 *           type: string
 *           example: User logged out successfully
 *           description: Message of the request
 *     500:
 *      description: Internal server error
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: Failed
 *           description: Status of the request
 *          msg:
 *           type: string
 *           example: Internal Server Error
 *           description: Error message
 */
routes.post("/user/logout", UserController.signout);
/**
 * @openapi
 * /user/reset-email:
 *   post:
 *    tags:
 *     - User
 *    summary: Reset login credentials
 *    description: Retrieve and update user credentials
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          description: Email to be registered
 *          example: jhondoe@email.com
 *    responses:
 *     200:
 *      description: Password reset email sent successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          msg:
 *           type: string
 *           example: Password reset email sent successfully!
 *           description: Message of the request
 *     422:
 *      description: Invalid data
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *           example: Email is required
 *           description: Email is required
 *     500:
 *      description: Internal server error
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          status:
 *           type: string
 *           example: Failed
 *           description: Status of the request
 *          msg:
 *           type: string
 *           example: Internal Server Error
 *           description: Error message
 */
routes.post("/user/reset-email", UserController.resetEmail);

// Project route

/**
 * @openapi
 * /project:
 *  get:
 *   tags:
 *   - Project
 *   summary: Get all projects
 *   description: This endpoint will return all projects
 *   responses:
 *    200:
 *     description: Projects found
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Project'
 *    500:
 *     description: Projects not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Failed
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: error
 *          description: Error message
 *    400:
 *     description: Invalid data
 *   security:
 *    - bearerAuth: []
 */
routes.get("/project", Middleware.verifyUser, ProjectController.store);
/**
 * @openapi
 * /project/create:
 *  post:
 *   tags:
 *    - Project
 *   summary: Create a new project
 *   description: This endpoint will create a new project
 *   requestBody:
 *    required: true 
 *    content:
 *     application/json:  
 *      schema:
 *       $ref: '#/components/schemas/CreateProject'
 *   responses:
 *    200:
 *     description: Project created successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Success
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: Data Saved
 *          description: Message of the request
 *    500:
 *     description: Project creation failed
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Failed
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: error
 *          description: Error message
 *   security:
 *    - bearerAuth: []
 */
routes.post("/project/create", Middleware.verifyUser, ProjectController.create);
/**
 * @openapi
 * /project/{id}:
 *  get:
 *   tags:
 *    - Project
 *   summary: Get a project
 *   description: This endpoint will return a project
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: Project ID
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Project found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Success
 *          description: Status of the request
 *         response:
 *          $ref: '#/components/schemas/Project'
 *    500:
 *     description: Project not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Failed
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: error
 *          description: Error message
 *   security:
 *    - bearerAuth: []
 */
routes.get("/project/:id", Middleware.verifyUser, ProjectController.index);
/**
 * @openapi
 * /project/{id}:
 *  put:
 *   tags:
 *    - Project
 *   summary: Update a project
 *   description: This endpoint will update a project
 *   parameters:
 *   - in: path
 *     name: id
 *     required: true
 *     description: Project ID
 *     schema:
 *      type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *      $ref: '#/components/schemas/UpdateProject'
 *   responses:
 *    200:
 *     description: Project updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Success
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: Data Updated
 *          description: Message of the request
 *    500:
 *     description: Project update failed
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Failed
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: error
 *          description: Error message
 *   security:
 *    - bearerAuth: []
 */
routes.put("/project/:id", Middleware.verifyUser, ProjectController.put);
/**
 * @openapi
 * /project/{id}:
 *  delete:
 *   tags:
 *    - Project
 *   summary: Delete a project
 *   description: This endpoint will delete a project
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: Project ID
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Project deleted successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Success
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: Data Deleted
 *          description: Message of the request
 *    500:
 *     description: Project deletion failed
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          example: Failed
 *          description: Status of the request
 *         msg:
 *          type: string
 *          example: error
 *          description: Error message
 *   security:
 *    - bearerAuth: []
 */
routes.delete("/project/:id", Middleware.verifyUser, ProjectController.delete);

// Service routes

/**
 * @openapi
 * /service/sun:
 *  post:
 *   tags:
 *    - Service
 *   summary: Search data Sun
 *   description: This endpoint returns sun position data, sunrise and sunset times and timezone information.
 *   parameters:
 *    - name: x-user-id
 *      in: header
 *      description: Id user an authorization header
 *      required: true
 *      type: string
 *    - name: x-api-key
 *      in: header
 *      description: Api Key an authorization header
 *      required: true
 *      type: string
 *   requestBody:
 *    required: true 
 *    content:
 *     application/json:  
 *      schema:
 *       type: object
 *       properties:
 *        lat:
 *         type: number
 *         example: 12.543
 *         description: Coordinated latitude for search 
 *        lng:
 *         type: number
 *         example: 12.543
 *         description: Coordinated longitude for search 
 *        dateTime:
 *         type: date-time
 *         example: '2017-07-21T17:32:28Z'
 *         description: Date time for search 
 *   responses:
 *    200:
 *     description: Request data successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/SunData'
 *    500:
 *     description: Request data failure
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          descrition: Failed requisition 
 *          example: Failed
 *         msg:
 *          type: string
 *          descrition: Message erro requisition 
 *          example: error
 *   security:
 *    - apiKeyAuth: []
 */
routes.post("/service/sun", Middleware.verifyKey, DateController.index);
/**
 * @openapi
 * /service/time-zone:
 *  post:
 *   tags:
 *    - Service
 *   summary: Search Time Zone
 *   description: This endpoint returns the time zone data for the input coordinates
 *   parameters:
 *    - name: x-user-id
 *      in: header
 *      description: Id user an authorization header
 *      required: true
 *      type: string
 *    - name: x-api-key
 *      in: header
 *      description: Api Key an authorization header
 *      required: true
 *      type: string
 *   requestBody:
 *    required: true 
 *    content:
 *     application/json:  
 *      schema:
 *       type: object
 *       properties:
 *        lat:
 *         type: number
 *         example: 12.543
 *         description: Coordinated latitude for search time zone
 *        lng:
 *         type: number
 *         example: 12.543
 *         description: Coordinated longitude for search time zone
 *   responses:
 *    200:
 *     description: Request data successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          description: Successfully
 *          example: Success
 *         data:
 *          type: object
 *          properties:
 *           lat:
 *            type: number
 *            example: 12.543
 *            description: Coordinates latitude entry
 *           lng:
 *            type: number
 *            example: 12.543
 *            description: Coordinates longitude entry
 *         timeZone:
 *          type: object
 *          properties:
 *           gmtOffset:
 *            type: number
 *            description: Offset of GMT in seconds
 *           zoneName:
 *            type: string
 *            description: Name of the time zone
 *    500:
 *     description: Request data failure
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          descrition: Failed requisition 
 *          example: Failed
 *         msg:
 *          type: string
 *          descrition: Message erro requisition 
 *          example: error
 *   security:
 *    - apiKeyAuth: []
 */
routes.post("/service/time-zone", Middleware.verifyKey, DateController.timeZone);
/**
 * @openapi
 * /service/api-key:
 *  get:
 *   tags:
 *    - Service
 *   summary: Fetch user's API key
 *   description: This endpoint returns returns the unique API key generated by the user
 *   responses:
 *    200:
 *     description: Request data successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          description: Successfully
 *          example: Success
 *         response:
 *          type: object
 *          properties:
 *           apiKey:
 *            type: object
 *            properties:
 *             usage:
 *              type: array
 *              items:
 *               type: object
 *               properties:
 *                date: 
 *                 type: string
 *                 description: API key usage date
 *                 example: "2024-09-12"
 *                count: 
 *                 type: number
 *                 description: Number of requests with the API key
 *                 example: 147 
 *             key:
 *              type: string
 *              description: Unique API key of the requesting user
 *              example: Dh7IS0K...          
 *    500:
 *     description: Request data failure
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          descrition: Failed requisition 
 *          example: Failed
 *         msg:
 *          type: string
 *          descrition: Message erro requisition 
 *          example: error
 *   security:
 *    - bearerAuth: []
 */
routes.get("/service/api-key", Middleware.verifyUser, ServiceController.getApiKey);
/**
 * @openapi
 * /service/generate-api-key:
 *  get:
 *   tags:
 *    - Service
 *   summary: Generate API key
 *   description: Create unique user API key
 *   responses:
 *    200:
 *     description: Create resource successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          description: Successfully
 *          example: Success
 *         msg:
 *          type: string
 *          description: Successfully data resource
 *          example: Data Saved        
 *    500:
 *     description: Request data failure
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          descrition: Failed requisition 
 *          example: Failed
 *         msg:
 *          type: string
 *          descrition: Message erro requisition 
 *          example: error
 *    429:
 *     description: Request data failure
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         code:
 *          type: number
 *          descrition: Code conflict requisition 
 *          example: 429
 *         msg:
 *          type: string
 *          descrition: Conflict requisition
 *          example: Maximum number of API keys reached
 *   security:
 *    - bearerAuth: []
 */
routes.get("/service/generate-api-key", Middleware.verifyUser, ServiceController.generateApiKey);
/**
 * @openapi
 * /service/refresh-token:
 *  post:
 *   tags:
 *    - Service
 *   summary: Refresh token user
 *   description: Update user access credentials
 *   requestBody:
 *    required: true 
 *    content:
 *     application/json:  
 *      schema:
 *       type: object
 *       properties:
 *        apiKey:
 *         type: string
 *         example: AnG4s...
 *         description: User API Key 
 *        refreshToken:
 *         type: string
 *         example: AIz...
 *         description: Credential Update Key
 *   responses:
 *    200:
 *     description: Create resource successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          description: Successfully
 *          example: Success
 *         data:
 *          type: object
 *          properties:
 *           access_token:
 *            type: string
 *            example: eyJhbG...
 *            description: Access token updated            
 *           expires_in:
 *            type: string
 *            example: 3600
 *            description: Time to expire
 *           token_type:
 *            type: string
 *            example: Bearer
 *            description: Type token
 *           refresh_token:
 *            type: string
 *            example: AMf-...
 *            description: Refresh Token
 *           id_token:
 *            type: string
 *            example: eyJhb
 *            description: Token ID
 *           user_id:
 *            type: string
 *            example: S3rd
 *            description: ID user
 *           project_id:
 *            type: string
 *            example: 4234...
 *            description: Project ID
 *    500:
 *     description: Request data failure
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *          descrition: Failed requisition 
 *          example: Failed
 *         msg:
 *          type: string
 *          descrition: Message erro requisition 
 *          example: error
 *    403:
 *     description: Request data failure
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          descrition: No API Key provided 
 *          example: No API Key provided
 */
routes.post("/service/refresh-token", ServiceController.refreshToken);

export { routes };
