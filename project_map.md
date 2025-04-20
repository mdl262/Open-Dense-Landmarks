[ App Startup ]
     |
     ├── load FLAME model .json
     |     |
     |     └── [ flameModel: { V0, S, E } ]
     |
     ├── init RMSProp Fitter
     |     |
     |     └── uses: flameModel
     |           creates: Fitter instance (stores params, V0, S, E, v, lr, etc.)
     |
     ├── init BlazeFace Detector
     |
     ├── init MobileNet Landmark Model
     |
     └── setup camera + canvas
           |
           └── start render loop → [Frame Capture Loop]
                                         |
                                         ├── detect face using BlazeFace
                                         |     |
                                         |     └── get bounding box → [getCropBoxFromDetection]
                                         |
                                         ├── crop face to 128x128 → [cropFace()]
                                         |
                                         ├── run MobileNet → [landmarks2D]
                                         |     |
                                         |     └── shape: [565 * 2]
                                         |
                                         ├── prepare combined input tensor:
                                         |     - [565 * 2 landmarks] + [565 logsigma] → [565 * 3 tensor]
                                         |
                                         ├── run FLAME Fitter RMSProp step
                                         |     |
                                         |     ├── updates: params, v
                                         |     └── returns: proj_a (projected landmarks)
                                         |
                                         └── draw:
                                               - Bounding box
                                               - 2D landmarks
                                               - Projected landmarks
