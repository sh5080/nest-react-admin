import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("Bayabas Web API")
    .setDescription("바야바즈 관리센터 CMS api")
    .setVersion("0.0.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      name: "JWT",
      in: "header",
    })
    .addServer(`http://${process.env.DEV_DOMAIN}:8081`, "로컬 ip 서버")
    .addServer("http://localhost:8081", "로컬 서버")
    .addServer("http://43.202.247.246:8081", "개발 서버")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);
}
