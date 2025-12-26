import Image from "next/image";
import Link from "next/link";

import { ImageLightbox } from "@/components/shared/image-lightbox";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-ink text-canvas">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* 项目信息 / About */}
        <div>
          <h3 className="mb-4 text-lg font-serif font-semibold">关于我们</h3>
          <p className="text-sm leading-relaxed text-canvas/80">
            浙江大学晨兴文化中国人才计划
            <br />
            Zhejiang University Morningside Cultural China Scholars Program
          </p>
        </div>

        {/* 快速链接 / Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-serif font-semibold">快速链接</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link className="text-canvas/80 transition-colors hover:text-accent" href="/intro">
                计划介绍
              </Link>
            </li>
            <li>
              <Link className="text-canvas/80 transition-colors hover:text-accent" href="/alumni">
                学员风采
              </Link>
            </li>
            <li>
              <Link className="text-canvas/80 transition-colors hover:text-accent" href="/admissions">
                招生信息
              </Link>
            </li>
          </ul>
        </div>

        {/* 关注我们 / Follow */}
        <div>
          <h3 className="mb-4 text-lg font-serif font-semibold">关注我们</h3>
          <div className="flex items-start space-x-4">
            <ImageLightbox
              alt="微信公众号二维码 / WeChat QR"
              className="h-28 w-28"
              src="/images/branding/wechat_code.jpg"
              thumbSize={112}
            />
            <div className="text-base text-canvas/80">
              <p className="mb-2">微信公众号</p>
              <p className="text-sm">扫码关注获取最新动态（点击二维码可放大）</p>
            </div>
          </div>
        </div>
      </div>



      {/* 版权信息 / Copyright */}
      <div>
        <div className="mx-auto max-w-screen-2xl px-4 py-6 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-canvas/60">
            © {new Date().getFullYear()} 浙江大学晨兴文化中国人才计划. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};







