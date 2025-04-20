# Acknowledgements

This project uses data from the **[DAD-3DHeads](https://github.com/saic-vul/dad-3dheads)** dataset:

> Martyniuk, Tetiana, Kupyn, Orest, Kurlyak, Yana, Krashenyi, Igor, Matas, Jiří, and Sharmanska, Viktoriia.  
> **DAD-3DHeads: A Large-scale Dense, Accurate and Diverse Dataset for 3D Head Alignment from a Single Image.**  
> In *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2022*.

If you use this dataset in your work, please cite the authors as:

```bibtex
@inproceedings{dad3dheads,
    title={DAD-3DHeads: A Large-scale Dense, Accurate and Diverse Dataset for 3D Head Alignment from a Single Image},
    author={Martyniuk, Tetiana and Kupyn, Orest and Kurlyak, Yana and Krashenyi, Igor and Matas, Ji\v{r}i and Sharmanska, Viktoriia},
    booktitle = {Proc. IEEE Conf. on Computer Vision and Pattern Recognition (CVPR)},
    year={2022}
}
```

---

This project uses a variant of **[MobileNetV3](https://arxiv.org/abs/1905.02244)**, developed by researchers at Google:

> Howard, Andrew, Sandler, Mark, Chu, Grace, Chen, Liang-Chieh, Chen, Bo, Tan, Mingxing, Wang, Weijun, Vasudevan, Vijay, Le, Quoc V., and Adam, Hartwig.  
> **Searching for MobileNetV3.**  
> In *Proceedings of the IEEE International Conference on Computer Vision (ICCV), 2019*.

```bibtex
@inproceedings{howard2019searching,
  title={Searching for MobileNetV3},
  author={Howard, Andrew and Sandler, Mark and Chu, Grace and Chen, Liang-Chieh and Chen, Bo and Tan, Mingxing and Wang, Weijun and Vasudevan, Vijay and Le, Quoc V and Adam, Hartwig},
  booktitle={Proceedings of the IEEE/CVF International Conference on Computer Vision},
  pages={1314--1324},
  year={2019}
}
```

---

This project uses the **[FLAME](https://flame.is.tue.mpg.de/)** 3D face model:

> Li, Tianye, Bolkart, Timo, Black, Michael J., Li, Hao, and Romero, Javier.  
> **Learning a model of facial shape and expression from 4D scans.**  
> In *ACM Transactions on Graphics (TOG), 36(6), 2017*.

```bibtex
@article{li2017learning,
  title={Learning a model of facial shape and expression from 4D scans},
  author={Li, Tianye and Bolkart, Timo and Black, Michael J and Li, Hao and Romero, Javier},
  journal={ACM Transactions on Graphics (TOG)},
  volume={36},
  number={6},
  pages={194},
  year={2017},
  publisher={ACM New York, NY, USA}
}
```

Please note: FLAME is distributed under a non-commercial academic license and is not bundled with this project. Users are responsible for obtaining the FLAME model from the official source.

This project uses a modified version of BlazeFace, a lightweight and real-time face detection model developed by Google Research and part of the MediaPipe framework:

> Bazarevsky, Valentin, Kartynnik, Yury, Vakunov, Andrey, Tkachenka, Ivan, Grundmann, Matthias.
> **BlazeFace: Sub-millisecond Neural Face Detection on Mobile GPUs.**
> in *Google AI Blog, 2019*.

```bibtex
@misc{blazeface2019,
  title={BlazeFace: Sub-millisecond Neural Face Detection on Mobile GPUs},
  author={Bazarevsky, Valentin and Kartynnik, Yury and Vakunov, Andrey and Tkachenka, Ivan and Grundmann, Matthias},
  year={2019},
  howpublished={Google AI Blog},
  url={https://ai.googleblog.com/2019/08/on-device-real-time-face-detection-with.html}
}
```
BlazeFace is distributed under the Apache 2.0 license as part of MediaPipe.
If you use BlazeFace in your work, please credit the authors appropriately.