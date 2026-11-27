// src/entity/base-time.entity.ts
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

// @Entity()가 없는 추상 클래스라서 테이블이 되지 않고, 상속한 엔티티에 컬럼만 물려줍니다.
export abstract class BaseTimeEntity {
  // INSERT 시점에 한 번만 채워지고 이후 바뀌지 않습니다.
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 저장될 때마다 TypeORM이 현재 시각으로 다시 채워줍니다.
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
