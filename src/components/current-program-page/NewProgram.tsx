import React, { Suspense } from 'react'
import { SITE_CONTAINER_CLASS } from '@/constant/siteContainer'
import MissionOverview from './ContentPrograms'
import ProjectInitiatives from '../home/project-Initiative/ProjectInitiatives'

export default function NewProgram() {
  return (
          <Suspense fallback={"loading..."}>
            <section className={`mt-4 ${SITE_CONTAINER_CLASS}`}>
                <div className="overflow-x-hidden mt-4">
                    <div className="bg-common bg-no-repeat bg-center bg-cover py-24 rounded-xl  flex justify-center items-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br" />
                        <h1
                            className=
                            'text-white  relative z-10 lg:text-6xl sm:text-4xl text-3xl flex flex-col gap-2 md:gap-4 justify-center items-center'
                        >
                            Programs
                        </h1>
                    </div>
                </div>
              <MissionOverview/>
              <ProjectInitiatives />
            </section>
          </Suspense>
  )
}
