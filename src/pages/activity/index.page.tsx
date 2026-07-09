/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  VStack,
  HStack,
  Text,
  useToken,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Select as SelectChakra } from "chakra-react-select";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { withTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { companiesGet } from "@component/store/companySlice";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { GetBotsByCompany } from "@component/store/botsSlice";
import { AppDispatch } from "@component/store";
import { useLazyGetActionsQuery, useLazyGetActivityQuery, useLazyGetResourcesQuery } from "@component/store/RTK/activity";
import { X } from "@untitled-ui/icons-react";
import PreviewChanges from "@component/components/PreviewChanges";
import { useError } from "@component/utils/errorContext";

const Activity = ({ t }) => {
  const { user } = useAuthStore();
  const { showError } = useError();
  const dispatch: AppDispatch = useDispatch();

  const {
    bgColor,
    panelBgColor,
    descriptionColor,
  } = useCoftechColors();

  const { companies, error: companiesError } = useSelector((state: any) => state.company);
  const { bots, error: botsError } = useSelector((resp: any) => resp.bots);

  const [trigger, { data, isLoading }] = useLazyGetActivityQuery()
  const [getActions, { data: actions }] = useLazyGetActionsQuery()
  const [getResources, { data: resources }] = useLazyGetResourcesQuery()

  const [company, setCompany] = useState("");
  const [bot, setBot] = useState();
  const [time, setTime] = useState("");
  const [read, setRead] = useState<any>({});
  const [changes, setChanges] = useState<number>(-1);
  const [args, setArgs] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [shadowColor] = useToken('colors', [bgColor]);
  const [modalChanges, setModalChanges] = useState([]);
  const [activity, setActivity] = useState("");
  const { isOpen: isPreviewOpen, onClose: previewClose, onOpen: previewOpen } = useDisclosure();

  const timeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = now.getTime() - past.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 5) return t("activity.now");
    if (seconds < 60) return seconds === 1 ? t("activity.second", { time: seconds }) : t("activity.seconds", { time: seconds });
    if (minutes < 60) return minutes === 1 ? t("activity.minute", { time: minutes }) : t("activity.minutes", { time: minutes });
    if (hours < 24) return hours === 1 ? t("activity.hour", { time: hours }) : t("activity.hours", { time: hours });
    if (days < 7) return days === 1 ? t("activity.day", { time: days }) : t("activity.days", { time: days });
    if (weeks < 5) return weeks === 1 ? t("activity.week", { time: weeks }) : t("activity.weeks", { time: weeks });
    if (months < 12) return months === 1 ? t("activity.month", { time: months }) : t("activity.months", { time: months });
    return years === 1 ? t("activity.year") : t("activity.years", { time: years });
  }

  const isMobile = useBreakpointValue({ base: true, md: false });

  function stringifyChanges(obj: any): string {
    if (typeof obj !== 'object' || obj === null) return String(obj);

    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  function getDateRangeFromDaysAgo(daysAgo: number): { startDate: string; endDate: string } {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysAgo);

    const startISO = startDate.toISOString().split('T')[0];
    const endISO = today.toISOString().split('T')[0];

    return {
      startDate: startISO,
      endDate: endISO,
    };
  }

  useEffect(() => {
    if (companiesError.message.length > 1) {
      showError(companiesError.message)
    }
  }, [companiesError])

  useEffect(() => {
    if (botsError.message.length > 1) {
      showError(botsError.message)
    }
  }, [botsError])

  const lang = t("integrations.lang")

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getActions({}).unwrap()
        await getResources({}).unwrap()
      } catch (err) {
        if (err.status === 404) {
          showError(err.data?.message)
        } else {
          showError(err.error)
        }
      }
    }

    fetchInitialData()
  }, [lang])

  useEffect(() => {
    if (user != null) {
      if (user?.rol_key === "SUPERADMIN") {
        dispatch(companiesGet());
      }
    }
  }, [user?.rol_key, dispatch, user?.company_id]);

  useEffect(() => {
    if (company) {
      dispatch(GetBotsByCompany(company));
    }
  }, [company, dispatch]);

  useEffect(() => {
    setTotalPages(data?.data?.totalPages || 1)
  }, [data?.data?.totalPages])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await trigger({ companyID: company, botID: bot, page: page, ...args }).unwrap()
      } catch (err) {
        if (err.status === 404) {
          showError(err.data?.message)
        } else {
          showError(err.error)
        }
      }
    }

    fetchActivities()
  }, [args, bot, company, page])

  useEffect(() => {
    setPage(1)
  }, [args, bot, company])

  useEffect(() => {
    if (!company) {
      setCompany(user?.company_id);
    }
  }, [company, user?.company_id]);

  const handleFilterByCompany = (company) => {
    if (company) {
      setCompany(company.value);
    }
  };

  const handleFilterByBot = (bot) => {
    if (bot) {
      setBot(bot.value);
    }
  }

  const handleFilterByTime = (time) => {
    if (time) {
      setTime(time.value);
      const { startDate, endDate } = getDateRangeFromDaysAgo(time.value);

      setArgs((prev) => {
        return { ...prev, startDate: startDate, endDate: endDate }
      })
    }
  }

  const handleFilterByAction = (action) => {
    if (action) {
      setArgs((prev) => {
        return { ...prev, action_type: action.value }
      })
    }
  }

  const handleFilterByCategory = (category) => {
    if (category) {
      setArgs((prev) => {
        return { ...prev, resource_type: category.value }
      })
    }
  }

  const companyOptions = (companies || []).map((company) => {
    return {
      value: company.uuid_unique,
      label: (
        <HStack>
          <Text>{company.name}</Text>
        </HStack>
      ),
    };
  })

  const botOptions = (bots || []).map((bot) => {
    return {
      value: bot.uuid_unique,
      label: (
        <HStack>
          <Text>{bot.name}</Text>
        </HStack>
      ),
    };
  })

  const actionOptions = (actions?.data || []).map((action) => {
    return {
      value: action.value,
      label: (
        <HStack>
          <Text>{action.text}</Text>
        </HStack>
      ),
    };
  })

  const resourceOptions = (resources?.data || []).map((resource) => {
    return {
      value: resource.value,
      label: (
        <HStack>
          <Text>{resource.text}</Text>
        </HStack>
      ),
    };
  })

  const durationOptions = (["1", "7", "15", "30"]).map((duration) => {
    return {
      value: duration,
      label: (
        <HStack>
          <Text>{Number(duration) > 1 ? t("home.lastDays", { days: duration }) : t("home.today")}</Text>
        </HStack>
      ),
    };
  });

  return (
    <AppShell title={t("activity.header")}>
      <Container maxW="full" p={4}>
        <PreviewChanges
          activity={activity}
          onClose={previewClose}
          isOpen={isPreviewOpen}
          changes={modalChanges}
          setModalChanges={setModalChanges}
        />
        {user?.rol_key == "SUPERADMIN" && (
          <VStack w={"full"}>
            <Text w={"100%"} textAlign={"left"}>
              {t(`fileManager.selectCompany`)}
            </Text>
            <SelectChakra
              isSearchable={false}
              onChange={handleFilterByCompany}
              options={companyOptions}
              focusBorderColor={shadowColor}
              value={companyOptions.filter((option) => option.value == company)}
              placeholder={t(`fileManager.selectCompany`)}
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  borderRadius: 20,
                  background: panelBgColor,
                  cursor: "pointer",
                  width: "100%",
                  maxW: isMobile ? "full" : "400px",
                  mb: "25px",
                  mr: "auto",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  color: bgColor,
                  width: "20px",
                  background: panelBgColor,
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: 20,
                }),
                inputContainer: (provided) => ({
                  ...provided,
                  width: "150px",
                }),
              }}
            />
          </VStack>
        )}
        {isMobile ? (
          <VStack justify="space-between" align="center" mb={4} gap={5}>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`fileManager.filterByBot`)}
              </Text>
              <SelectChakra
                isSearchable={false}
                onChange={handleFilterByBot}
                focusBorderColor={shadowColor}
                options={botOptions}
                value={botOptions.filter((option) => option.value == bot)}
                placeholder={t(`fileManager.filterByBot`)}
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                    background: panelBgColor,
                    cursor: "pointer",
                    width: "100%",
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: bgColor,
                    width: "20px",
                    background: panelBgColor,
                  }),
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                  }),
                  inputContainer: (provided) => ({
                    ...provided,
                    width: "150px",
                  }),
                }}
              />
            </VStack>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`activity.filterByDate`)}
              </Text>
              <SelectChakra
                isSearchable={false}
                onChange={handleFilterByTime}
                value={durationOptions.filter((option) => option.value == time)}
                options={durationOptions}
                focusBorderColor={shadowColor}
                placeholder={t(`activity.filterByDate`)}
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                    background: panelBgColor,
                    cursor: "pointer",
                    width: "100%",
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: bgColor,
                    width: "20px",
                    background: panelBgColor,
                  }),
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                  }),
                  inputContainer: (provided) => ({
                    ...provided,
                    width: "150px",
                  }),
                }}
              />
            </VStack>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`activity.filterByCategory`)}
              </Text>
              <HStack w={"full"}>
                <SelectChakra
                  isSearchable={false}
                  onChange={handleFilterByCategory}
                  options={resourceOptions}
                  value={resourceOptions.filter((option) => option.value == args.resource_type)}
                  placeholder={t(`activity.filterByCategory`)}
                  focusBorderColor={shadowColor}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      background: panelBgColor,
                      cursor: "pointer",
                      width: "100%",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: "20px",
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                    }),
                    inputContainer: (provided) => ({
                      ...provided,
                      width: "150px",
                    }),
                  }}
                />
                <Button
                  bg={"transparent"}
                  border={`1px solid ${shadowColor}`}
                  color={bgColor}
                  _hover={{
                    bg: bgColor,
                    color: panelBgColor
                  }}
                  onClick={() => {
                    setArgs((prev) => {
                      const { resource_type, ...rest } = prev;
                      return rest;
                    })
                  }}
                >
                  <X />
                </Button>
              </HStack>
            </VStack>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`activity.filterByAction`)}
              </Text>
              <HStack w={"full"}>
                <SelectChakra
                  isSearchable={false}
                  onChange={handleFilterByAction}
                  focusBorderColor={shadowColor}
                  options={actionOptions}
                  value={actionOptions.filter((option) => option.value == args.action_type)}
                  placeholder={t(`activity.filterByAction`)}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      background: panelBgColor,
                      cursor: "pointer",
                      width: "100%",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: "20px",
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                    }),
                    inputContainer: (provided) => ({
                      ...provided,
                      width: "150px",
                    }),
                  }}
                />
                <Button
                  bg={"transparent"}
                  border={`1px solid ${shadowColor}`}
                  color={bgColor}
                  _hover={{
                    bg: bgColor,
                    color: panelBgColor
                  }}
                  onClick={() => {
                    setArgs((prev) => {
                      const { action_type, ...rest } = prev;
                      return rest;
                    })
                  }}
                >
                  <X />
                </Button>
              </HStack>
            </VStack>
          </VStack>
        ) : (
          <HStack justify="space-between" align="center" mb={4} gap={5}>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`fileManager.filterByBot`)}
              </Text>
              <SelectChakra
                isSearchable={false}
                onChange={handleFilterByBot}
                focusBorderColor={shadowColor}
                options={botOptions}
                value={botOptions.filter((option) => option.value == bot)}
                placeholder={t(`fileManager.filterByBot`)}
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                    background: panelBgColor,
                    cursor: "pointer",
                    width: "100%",
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: bgColor,
                    width: "20px",
                    background: panelBgColor,
                  }),
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                  }),
                  inputContainer: (provided) => ({
                    ...provided,
                    width: "150px",
                  }),
                }}
              />
            </VStack>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`activity.filterByDate`)}
              </Text>
              <SelectChakra
                isSearchable={false}
                onChange={handleFilterByTime}
                value={durationOptions.filter((option) => option.value == time)}
                options={durationOptions}
                focusBorderColor={shadowColor}
                placeholder={t(`activity.filterByDate`)}
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                    background: panelBgColor,
                    cursor: "pointer",
                    width: "100%",
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: bgColor,
                    width: "20px",
                    background: panelBgColor,
                  }),
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                  }),
                  inputContainer: (provided) => ({
                    ...provided,
                    width: "150px",
                  }),
                }}
              />
            </VStack>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`activity.filterByCategory`)}
              </Text>
              <HStack w={"full"}>
                <SelectChakra
                  isSearchable={false}
                  onChange={handleFilterByCategory}
                  options={resourceOptions}
                  value={resourceOptions.filter((option) => option.value == args.resource_type)}
                  placeholder={t(`activity.filterByCategory`)}
                  focusBorderColor={shadowColor}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      background: panelBgColor,
                      cursor: "pointer",
                      width: "100%",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: "20px",
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                    }),
                    inputContainer: (provided) => ({
                      ...provided,
                      width: "150px",
                    }),
                  }}
                />
                <Button
                  bg={"transparent"}
                  border={`1px solid ${shadowColor}`}
                  color={bgColor}
                  _hover={{
                    bg: bgColor,
                    color: panelBgColor
                  }}
                  onClick={() => {
                    setArgs((prev) => {
                      const { resource_type, ...rest } = prev;
                      return rest;
                    })
                  }}
                >
                  <X />
                </Button>
              </HStack>
            </VStack>
            <VStack w={"full"}>
              <Text w={"100%"} textAlign={"left"}>
                {t(`activity.filterByAction`)}
              </Text>
              <HStack w={"full"}>
                <SelectChakra
                  isSearchable={false}
                  onChange={handleFilterByAction}
                  focusBorderColor={shadowColor}
                  options={actionOptions}
                  value={actionOptions.filter((option) => option.value == args.action_type)}
                  placeholder={t(`activity.filterByAction`)}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      background: panelBgColor,
                      cursor: "pointer",
                      width: "100%",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: "20px",
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                    }),
                    inputContainer: (provided) => ({
                      ...provided,
                      width: "150px",
                    }),
                  }}
                />
                <Button
                  bg={"transparent"}
                  border={`1px solid ${shadowColor}`}
                  color={bgColor}
                  _hover={{
                    bg: bgColor,
                    color: panelBgColor
                  }}
                  onClick={() => {
                    setArgs((prev) => {
                      const { action_type, ...rest } = prev;
                      return rest;
                    })
                  }}
                >
                  <X />
                </Button>
              </HStack>
            </VStack>
          </HStack >
        )}

        <VStack w={"99%"} m={"auto"} gap={5}>
          {isLoading ? (
            <></>
          ) : data?.data?.items?.map((item, index) => {
            if (index <= 10) {
              return (
                <HStack
                  key={index}
                  bg={panelBgColor}
                  p={6}
                  borderRadius="20px"
                  boxShadow="md"
                  w={"full"}
                  border={"2px solid"}
                  borderColor={"transparent"}
                  _hover={item.metadata?.changes && Object.entries(item.metadata?.changes).length > 0 ? {
                    cursor: "pointer",
                    borderColor: bgColor,
                    boxShadow: `0 0 5px 1px ${shadowColor}`
                  } : {}}
                  onClick={() => {
                    if (item.metadata?.changes != undefined && item.metadata?.changes != null) {
                      if (Object.entries(item.metadata?.changes)) {
                        let modalNotOpen = true;
                        const list = Object.entries(item.metadata?.changes)
                        for (let i = 0; i < list.length; i++) {
                          if (list[i].length > 1) {
                            for (let j = 0; j < list[i].length; j++) {
                              if (String(list[i][j]).length > 100) {
                                setActivity(item.message)
                                setModalChanges(Object.entries(item.metadata?.changes));
                                setChanges(-1)
                                previewOpen();
                                modalNotOpen = false
                                break;
                              }
                            }
                            if (modalChanges != null) {
                              break;
                            }
                          }
                        }
                        if (modalNotOpen) {
                          if (changes != index) {
                            setChanges(index)
                            setRead({ index })
                          } else {
                            setChanges(-1)
                          }
                        }
                      }
                    }
                  }}
                >
                  <VStack w={"full"} gap={"0px"}>
                    <HStack w={"full"}>
                      <Text fontWeight={"bold"} m={0} mr={"auto"} p={0}>{t(`activity.title`, { a: item.action_type, b: item.resource_type })}</Text>
                      <Box
                        bg={item.status == "success" ? "green.400" : "red"}
                        w={"120px"}
                        py={1}
                        borderRadius="md"
                        ml={"auto"}
                        color={"white"}
                      >
                        <Text w={"full"} textAlign={"center"}>{item.status == "success" ? t(`fileManager.success`) : t(`activity.failed`)}</Text>
                      </Box>
                    </HStack>
                    <Text m={0} mr={"auto"} mb={"15px"} p={0} maxW={"550px"} color={descriptionColor} fontSize={"15px"} >
                      {item.message.length > 109 && read["index"] != index ? `${item.message.slice(0, item.message.slice(0, 110).lastIndexOf(" "))}... ${t(`activity.readMore`)}` : item.message}
                    </Text>
                    {item.metadata?.changes && changes == index && Object.entries(item.metadata?.changes).length > 0 && (
                      <>
                        <Text m={0} mr={"auto"} p={0} color={descriptionColor} mb={"5px"} fontSize={"15px"}>{t(`activity.changes`)}</Text>
                        <Box mb={"10px"} mr={"auto"}>
                          {Object.entries(item.metadata?.changes || { none: "none" }).map(([key, value]) => {
                            if (key != "none") {
                              return (
                                <Box key={`${key}-${index}`} mb={"10px"}>
                                  <Text m={0} mr={"auto"} mb={"5px"} p={0} fontSize={"15px"} fontWeight={"bold"}>{key}:</Text>
                                  <Text m={0} mr={"auto"} p={0} fontSize={"15px"}>{stringifyChanges(value)}</Text>
                                </Box>
                              )
                            }
                          })}
                        </Box>
                      </>
                    )}
                    <HStack w={"full"}>
                      <HStack>
                        <Text fontWeight={"bold"}>{t(`activity.user`)}</Text>
                        <Text>{item.user_id}</Text>
                      </HStack>
                      <Text ml={"auto"} color={descriptionColor}>{timeAgo(item.created_at)}</Text>
                    </HStack>
                  </VStack>
                </HStack>
              )
            }
          })}
        </VStack>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={4}
          p={2}
          flexWrap={"wrap"}
          gap={"8px"}
          overflowX={"auto"}
        >
          <Text fontSize={16} fontWeight={500} color={descriptionColor}>
            {t("campaigns.showing")} {data?.data?.items?.length}{" "}
            {t("campaigns.of")} {data?.data?.total} {t("campaigns.entries")}
          </Text>
          <HStack>
            <Button
              onClick={() =>
                setPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={page === 1}
            >
              {t("campaigns.previous")}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (eachPage) => (
                <Button
                  key={eachPage}
                  onClick={() => setPage(eachPage)}
                  variant={eachPage === page ? "solid" : "outline"}
                >
                  {eachPage}
                </Button>
              )
            )}
            <Button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={page === totalPages}
            >
              {t("campaigns.next")}
            </Button>
          </HStack>
        </Box>
      </Container >
    </AppShell >
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Activity);
